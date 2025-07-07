
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=100, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class UserRole(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('engineer', 'Engineer'),
        ('viewer', 'Viewer'),
        ('approver', 'Approver'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roles')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_roles')
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'role']

class UserPreferences(models.Model):
    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('auto', 'Auto'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='dark')
    dashboard_layout = models.JSONField(default=dict)
    notification_settings = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
