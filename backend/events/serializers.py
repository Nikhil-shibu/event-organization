from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Event, EventParticipation

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'user_type', 'student_id']

class EventSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=Event.STATUS_CHOICES, read_only=True)
    created_by = UserSerializer(read_only=True)
    current_participants = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'time', 'location', 'max_participants', 'current_participants', 'category', 'status', 'created_by']

class EventParticipationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = EventParticipation
        fields = ['id', 'user', 'event', 'status', 'created_at', 'updated_at']
