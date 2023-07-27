from django.contrib import admin
from .models import CustomUser

# Register your models here.


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'is_staff', 'is_active', 'date_joined', 'role')

admin.site.register(CustomUser, CustomUserAdmin)
