from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import FavoriteWord

admin.site.register(FavoriteWord)

