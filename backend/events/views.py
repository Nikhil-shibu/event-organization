from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Event, EventParticipation
from .serializers import EventSerializer, EventParticipationSerializer

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Update event statuses before returning
        for event in queryset:
            event.update_status()
        
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            # Handle both 'upcoming' and 'ongoing' as active events
            if status_filter == 'ongoing':
                queryset = queryset.filter(status__in=['upcoming', 'ongoing'])
            else:
                queryset = queryset.filter(status=status_filter)
        return queryset.order_by('date', 'time')
    
    def perform_create(self, serializer):
        # Only admins can create events
        if not self.request.user.is_admin():
            raise permissions.PermissionDenied("Only admins can create events")
        serializer.save(created_by=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def perform_update(self, serializer):
        # Only admins can update events
        if not self.request.user.is_admin():
            raise permissions.PermissionDenied("Only admins can update events")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only admins can delete events
        if not self.request.user.is_admin():
            raise permissions.PermissionDenied("Only admins can delete events")
        instance.delete()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_event(request, event_id):
    """Join an event"""
    event = get_object_or_404(Event, id=event_id)
    
    if event.is_full():
        return Response({'error': 'Event is full'}, status=status.HTTP_400_BAD_REQUEST)
    
    participation, created = EventParticipation.objects.get_or_create(
        user=request.user,
        event=event,
        defaults={'status': 'joined'}
    )
    
    if not created:
        if participation.status == 'joined':
            return Response({'message': 'Already joined this event'}, status=status.HTTP_200_OK)
        else:
            # Update status to joined, adjust count if previously skipped
            if participation.status == 'skipped':
                # Count should increase when changing from skipped to joined
                event.current_participants += 1
                event.save()
            participation.status = 'joined'
            participation.save()
    else:
        # New participation, increase count
        event.current_participants += 1
        event.save()
    
    return Response({'message': 'Successfully joined event'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def skip_event(request, event_id):
    """Skip an event"""
    event = get_object_or_404(Event, id=event_id)
    
    participation, created = EventParticipation.objects.get_or_create(
        user=request.user,
        event=event,
        defaults={'status': 'skipped'}
    )
    
    if not created:
        if participation.status == 'joined':
            # User was joined, now skipping - decrease count
            event.current_participants = max(0, event.current_participants - 1)
            event.save()
        participation.status = 'skipped'
        participation.save()
    
    return Response({'message': 'Event skipped'}, status=status.HTTP_200_OK)

class UserEventParticipationsView(generics.ListAPIView):
    serializer_class = EventParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EventParticipation.objects.filter(user=self.request.user)

class StudentEventsView(generics.ListAPIView):
    """View for students to see all events with their participation status"""
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]  # Allow all users including unauthenticated
    
    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Update event statuses
        for event in queryset:
            event.update_status()
        
        return queryset.order_by('date', 'time')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add participation status if user is authenticated
        if request.user.is_authenticated:
            user_participations = EventParticipation.objects.filter(user=request.user)
            participation_map = {p.event_id: p.status for p in user_participations}
            
            for event_data in serializer.data:
                event_data['user_participation_status'] = participation_map.get(event_data['id'], 'pending')
        
        return Response(serializer.data)
