from django.shortcuts import render
from django.urls import reverse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from .models import Task, User, Result
from .serializers import TaskSerializer, LoginSerializer, RegisterSerializer, ResultSerializer
from django.contrib.auth import login, logout


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

    response = Response({'message': 'Logout successful'}, status=200)
    response.delete_cookie('sessionid')

    return response

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


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_audio(request):
    task_id = request.data.get('task_id')
    audio_file = request.FILES.get('audio_file')

    if not task_id or not audio_file:
        return Response({'error': 'Task ID and audio file are required'}, status=400)

    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    result = Result.objects.create(
        recoded_audio=audio_file.read(),
        voice_statistics={"placeholder": "data"},  # Placeholder for voice statistics
        ai_response_text="Placeholder AI response",  # Placeholder for AI response text
        user_id=1,
        task=task
    )

    serializer = ResultSerializer(result)
    return Response(serializer.data, status=201)

@api_view(['GET'])
def get_all_results(request):
    results = Result.objects.all()
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)  # Return JSON response

def check_login(request):
    if request.user.is_authenticated:
        return Response({'logged_in': True}, status=200)
    return Response({'logged_in': False}, status=401)
