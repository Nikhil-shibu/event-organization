from django.db import models
from django.conf import settings
from django.utils import timezone

class Event(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('past', 'Past'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=200)
    max_participants = models.PositiveIntegerField()
    current_participants = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='upcoming')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-time']
    
    def __str__(self):
        return self.title
    
    def update_status(self):
        """Automatically update event status based on date"""
        now = timezone.now().date()
        if self.date < now:
            self.status = 'past'
        elif self.date == now:
            self.status = 'ongoing'
        else:
            self.status = 'upcoming'
        self.save()
    
    def is_full(self):
        return self.current_participants >= self.max_participants

class EventParticipation(models.Model):
    STATUS_CHOICES = (
        ('joined', 'Joined'),
        ('skipped', 'Skipped'),
        ('pending', 'Pending'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_participations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participations')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'event')
    
    def __str__(self):
        return f"{self.user.first_name} - {self.event.title} ({self.status})"
