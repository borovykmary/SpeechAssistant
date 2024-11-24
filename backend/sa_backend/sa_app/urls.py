# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.get_all_tasks, name='get_all_tasks'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('register/', views.register_user, name='register_user'),
    path('', views.landing_page, name='landing_page'),
    path('upload_audio/', views.upload_audio, name='upload_audio')
]
