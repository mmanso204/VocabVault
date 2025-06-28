from django.contrib import admin

from .models import Words, FrenchWord, GermanWord

admin.site.register(Words)
admin.site.register(FrenchWord)
admin.site.register(GermanWord)