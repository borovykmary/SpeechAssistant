# serializers.py
from rest_framework import serializers
import re
from .models import Task, User, UserAudio
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

class UserAudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAudio
        fields = ['id', 'user', 'task_id', 'audio_file', 'uploaded_at']