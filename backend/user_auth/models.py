import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.CharField(_("User ID"), max_length=36, unique=True)
    username = models.CharField(_("username"), max_length=150, unique=True)
    email = models.EmailField(_("email address"), unique=True, default='example@example.com')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=100)
    first_name = models.CharField(max_length=32, blank=True)
    last_name = models.CharField(max_length=32, blank=True)
    image = models.CharField(max_length=255, default='https://www.gravatar.com/avatar/?d=mp', blank=True)
    sex = models.CharField(max_length=32, blank=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    def save(self, *args, **kwargs):
        if not self.user_id:
            self.user_id = uuid.uuid4().hex  
        super().save(*args, **kwargs)