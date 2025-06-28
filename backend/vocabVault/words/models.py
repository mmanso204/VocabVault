from django.db import models

class Words(models.Model):
    phonetic = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.CharField(max_length=2000, blank=True, null=True)
    date = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=255, blank=True, null=True)
    word = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'words'

class FrenchWord(models.Model):
    phonetic = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.CharField(max_length=2000, blank=True, null=True)
    date = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=255, blank=True, null=True)
    word = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'words_fr'

class GermanWord(models.Model):
    phonetic = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.CharField(max_length=2000, blank=True, null=True)
    date = models.CharField(max_length=255, blank=True, null=True)
    function = models.CharField(max_length=255, blank=True, null=True)
    word = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'words_ge'