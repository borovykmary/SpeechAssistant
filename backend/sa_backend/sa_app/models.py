from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Custom User Model (optional, use default User model if not necessary)
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, blank=True, null=True)
    hashed_password = models.CharField(max_length=255)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

# Events Table
class Event(models.Model):
    event_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return f"Event on {self.event_date} for {self.user.email}"

# Meditations Table
class Meditation(models.Model):
    meditation_type = models.CharField(max_length=50)
    meditation_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.meditation_type

# Tasks Table
class Task(models.Model):
    task_description = models.TextField()
    audio_sample = models.BinaryField(blank=True, null=True)  # Store binary data for audio files (e.g., WAV or MP3)
    text_sample = models.TextField(blank=True, null=True)
    emotion = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"Task for {self.user.email} with emotion {self.emotion}"

# Results Table
class Result(models.Model):
    recoded_audio = models.BinaryField(blank=True, null=True)
    voice_statistics = models.JSONField(blank=True, null=True)  # JSON field for storing complex statistics
    ai_response_text = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='results')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='results')

    def __str__(self):
        return f"Result for {self.user.email} on task {self.task.id}"
