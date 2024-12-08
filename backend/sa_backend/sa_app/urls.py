# urls.py
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import UploadAudioView


urlpatterns = [
    path('tasks/', views.get_all_tasks, name='get_all_tasks'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('register/', views.register_user, name='register_user'),
    path('', views.landing_page, name='landing_page'),
    path('api/upload_audio/', UploadAudioView.as_view(), name='upload_audio'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
