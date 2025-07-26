from django.core.management.base import BaseCommand
from events.models import Event

class Command(BaseCommand):
    help = 'Update event statuses based on current date'

    def handle(self, *args, **options):
        events = Event.objects.all()
        updated_count = 0
        
        for event in events:
            old_status = event.status
            event.update_status()
            if event.status != old_status:
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Updated event "{event.title}" from {old_status} to {event.status}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} event statuses')
        )
