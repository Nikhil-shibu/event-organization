from django.urls import path
from .views import (
    EventListCreateView, 
    EventDetailView, 
    join_event, 
    skip_event, 
    UserEventParticipationsView,
    StudentEventsView
)

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event_list_create'),
    path('student/', StudentEventsView.as_view(), name='student_events'),
    path('<int:pk>/', EventDetailView.as_view(), name='event_detail'),
    path('<int:event_id>/join/', join_event, name='join_event'),
    path('<int:event_id>/skip/', skip_event, name='skip_event'),
    path('my-participations/', UserEventParticipationsView.as_view(), name='user_participations'),
]
