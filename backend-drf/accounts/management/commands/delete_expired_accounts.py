from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import User

class Command(BaseCommand):
    help = 'Deletes accounts whose deletion date is expired'
    def handle(self, *args, **kwargs):
        expired_users = User.objects.filter(is_deleted=True, deletion_date__lte=timezone.now())
        count = expired_users.count()
        
        expired_users.delete()
        
        self.stdout.write(self.style.SUCCESS(f'{count} expired accounts deleted successfully'))