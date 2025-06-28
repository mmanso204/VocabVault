from django.db import models
from django.contrib.auth.models import User
'''
Django's built-in User model is a part of Django's authentication system.
It provides a fully functional user model with commonly-used fields and methods. 
'''


# A custom user model extending Django's built-in User model with additional information.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(max_length=254, unique=True, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    favorite_words = models.ManyToManyField('FavoriteWord', related_name='users', blank=True)

    
    def __str__(self):
        return self.user.username

class FavoriteWord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Example field, adjust as per your 
    phonetic = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.CharField(max_length=2000, blank=True, null=True)
    date = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=255, blank=True, null=True)
    word = models.CharField(max_length=255, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)

    id = models.AutoField(primary_key=True)
    
    def __str__(self):
        return self.word