from django.contrib import admin
from .models import Event, EventParticipation

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'time', 'location', 'category', 'status', 'created_by']
    list_filter = ['status', 'category', 'created_by']
    search_fields = ['title', 'location', 'category']
    ordering = ['date', 'time']

@admin.register(EventParticipation)
class EventParticipationAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'status', 'created_at']
    list_filter = ['status', 'event']
    search_fields = ['user__email', 'event__title']
    ordering = ['created_at']
