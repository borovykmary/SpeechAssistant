# serializers.py
from rest_framework import serializers
import re
from .models import Task, User, Result, Event
from django.contrib.auth import authenticate


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'task_description', 'audio_sample', 'text_sample', 'emotion']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request=self.context.get('request'), username=email, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid email or password')

        data['user'] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email', 'password', 'password2']

    def validate(self, data):
        password = data['password']
        password2 = data['password2']
        if password != password2:
            raise serializers.ValidationError("Passwords aren't the same.")

        if len(password) < 8:
            raise serializers.ValidationError("Password is too short.")
        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[0-9]', password):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError("Password must contain at least one special character.")

        return data

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'recoded_audio', 'voice_statistics', 'ai_response_text', 'user', 'task', 'date']

    def validate(self, data):
        if not data.get('recoded_audio'):
            raise serializers.ValidationError("Recorded audio is required.")
        if not data.get('user'):
            raise serializers.ValidationError("User is required.")
        if not data.get('task'):
            raise serializers.ValidationError("Task is required.")
        return data

    def create(self, validated_data):
        return Result.objects.create(**validated_data)


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_date', 'description', 'user']