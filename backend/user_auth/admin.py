from django.contrib import admin
from .models import CustomUser

# Register your models here.


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id','email','username', 'is_staff', 'is_active', 'date_joined', 'role', 'email_verified')

admin.site.register(CustomUser, CustomUserAdmin)
