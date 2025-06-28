"""
URL configuration for VocabVault project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from users import views as users_views 


appname = 'words'
urlpatterns = [
    path('homepage/', views.homepage, name='home'),
    path('select_language/<str:language>/', views.select_language, name='select_language'),
    path('members/', views.members, name='members'),
    path('searchresults/', views.searchresults, name='searchresults'),
    path('account/', views.account, name='account'),
    path('addnewword/', views.addword, name='addword'),
    path('favorites/', users_views.show_favorite_words, name='favorites'),
    path('delete_favorite/<int:favorite_id>/', views.delete_favorite, name='delete_favorite'),
    path('flashcards/', views.flashcards, name='flashcards'),
    path('quizzes/', views.quizzes, name='quizzes'),
    path('wordle/', views.wordle, name='wordle'),
    path('', views.index, name='index'),
    path('word/<int:word_id>/', views.wordDetail, name='wordDetail'),
    path('get_words/', views.get_words, name='getWords'),
    path('add-to-favorites/', views.add_to_favorite, name='add_to_favorites'),
    path('editword/<int:word_id>/', views.edit_word, name='edit_word'),
    
    
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



