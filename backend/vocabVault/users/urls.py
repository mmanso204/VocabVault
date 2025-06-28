from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from . import views
from words import views as word_views 

app_name = 'users'
urlpatterns = [
    path('register/', views.user_register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('update_user_info', views.update_user_info, name='update_user_info'),
    path('homepage/', word_views.homepage, name='homepage'),
    path('favorites/', views.show_favorite_words, name='favorites'),
    #path('edit_favorite/<int:favorite_id>/', views.edit_favorite, name='edit_favorite'),  # URL for editing a specific favorite
    path('editword/<int:word_id>/', views.edit_word, name='edit_word'),

    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)