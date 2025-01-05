# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.get_all_tasks, name='get_all_tasks'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('register/', views.register_user, name='register_user'),
    path('', views.landing_page, name='landing_page'),
    path('upload_audio/', views.upload_audio, name='upload_audio'),
    path('results/', views.get_all_results, name='get_all_results'),
    path('check_login/', views.check_login, name='check_login'),
    path('schedule_event/', views.schedule_event, name='schedule_event'),
    path('get_events/', views.get_events, name='get_events'),
]

