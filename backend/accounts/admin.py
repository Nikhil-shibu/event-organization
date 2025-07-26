from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'user_type', 'student_id', 'is_active']
    list_filter = ['user_type', 'is_active', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name', 'student_id']
    ordering = ['email']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'student_id')}),
    )
