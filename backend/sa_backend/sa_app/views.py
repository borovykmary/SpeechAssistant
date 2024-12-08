from django.shortcuts import render
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Task, UserAudio
from .serializers import TaskSerializer, LoginSerializer, RegisterSerializer, UserAudioSerializer
from django.contrib.auth import login, logout
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
def get_all_tasks(request):
    tasks = Task.objects.all()  # Fetch all tasks
    serializer = TaskSerializer(tasks, many=True)  # Serialize data
    return Response(serializer.data)  # Return JSON response


@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({'message': 'Login successful'}, status=200)
    return Response({'message': 'Login failed', 'error': serializer.errors}, status=400)


@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=200)


@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {'message': 'Registration successful', 'user': {'email': user.email}},
            status=201
        )
    else:
        return Response(
            {'message': 'Registration failed', 'errors': serializer.errors},
            status=400
        )


@api_view(['GET'])
def landing_page(request):
    login_url = request.build_absolute_uri(reverse('login_user'))
    return Response({
        'message': 'Redirection succeeded',
        'login_url': login_url,
    }, status=200)

class UploadAudioView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def post(self, request, *args, **kwargs):
        user = request.user
        audio_file = request.FILES.get('audio_file')
        if not audio_file:
            return Response({"error": "Audio file is required"}, status=400)


        audio = UserAudio.objects.create(user=user, audio_file=audio_file)

        # Serialize the response
        serializer = UserAudioSerializer(audio)
        return Response(serializer.data, status=201)