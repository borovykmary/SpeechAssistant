from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from .models import Task, User, Result, Event
from .serializers import TaskSerializer, LoginSerializer, RegisterSerializer, ResultSerializer, EventSerializer
from django.contrib.auth import login, logout
from .services.algorithm.analyze_audio import analyze_voice
from .services.algorithm.language_processing import get_emotion_analysis
import os
import tempfile
from pydub import AudioSegment
import json
from django.http import JsonResponse


@api_view(['GET'])
def get_all_tasks(request):
    tasks = Task.objects.all()  # Fetch all tasks
    serializer = TaskSerializer(tasks, many=True)  # Serialize data
    return Response(serializer.data)  # Return JSON response


@api_view(['GET'])
def get_task_by_id(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    serializer = TaskSerializer(task)
    return Response(serializer.data)


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


@api_view(['GET'])
def get_all_results(request):
    results = Result.objects.all()
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)  # Return JSON response


@api_view(['GET'])
def get_user_id(request, email):
    try:
        user = User.objects.get(email=email)
        return JsonResponse({'user_id': user.id}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)


@api_view(['GET'])
def check_login(request):
    if request.user.is_authenticated:
        return Response({'logged_in': True}, status=200)
    return Response({'logged_in': False}, status=401)


@api_view(['POST'])
def schedule_event(request):
    user = request.user

    request_data = request.data.copy()
    request_data['user'] = user.pk

    serializer = EventSerializer(data=request_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_events(request):
    user = request.user
    events = Event.objects.filter(user=user.pk)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def analyze_audio(request):
    SAMPLING_RATE = 16000
    audio_file = request.FILES.get('audio_file')
    emotion = request.POST.get('emotion')
    if not audio_file:
        return Response({'error': 'Audio file is required'}, status=400)

    if not emotion:
        return Response({'error': 'Emotion is required'}, status=400)

    temp_dir = os.path.join(os.path.dirname(__file__), 'services', 'algorithm')
    os.makedirs(temp_dir, exist_ok=True)

    temp_file_path = os.path.join(temp_dir, 'recording.webm')
    try:
        with open(temp_file_path, 'wb') as temp_file:
            for chunk in audio_file.chunks():
                temp_file.write(chunk)
        print(f"Temporary file created at: {temp_file_path}")

        audio = AudioSegment.from_file(temp_file_path, format="webm")
        wav_file_path = os.path.join(temp_dir, 'recording.wav')
        audio = audio.set_frame_rate(SAMPLING_RATE)
        audio.export(wav_file_path, format="wav")

        voice_analysis = analyze_voice(wav_file_path)
        print(f"Voice analysis result: {voice_analysis}")
        voice_analysis_str = json.dumps(voice_analysis)
        emotion_analysis = get_emotion_analysis(voice_analysis_str, emotion)
        print(f"Emotion analysis result: {emotion_analysis}")
    except Exception as e:
        print(f"Error processing audio file: {e}")
        return Response({'error': str(e)}, status=500)
    finally:
        os.remove(temp_file_path)
        os.remove(wav_file_path)
    return Response(
        {'voice_analysis': voice_analysis, 'llm_response': emotion_analysis, 'temp_file_path': wav_file_path},
        status=200)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_audio(request):
    task_id = request.data.get('task_id')
    audio_file = request.FILES.get('audio_file')
    user_id = request.data.get('user_id')
    voice_statistics = request.data.get('voice_statistics')
    llm_response = request.data.get('llm_response')

    if not task_id or not audio_file or not user_id or not voice_statistics or not llm_response:
        return Response({'error': 'Task ID, audio file, user ID, voice statistics, and LLM response are required'},
                        status=400)

    try:
        task = Task.objects.get(id=task_id)
        user = User.objects.get(id=user_id)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    try:
        result = Result.objects.create(
            recoded_audio=audio_file.read(),
            voice_statistics=voice_statistics,
            ai_response_text=llm_response,
            user=user,
            task=task
        )

        serializer = ResultSerializer(result)
        return Response(serializer.data, status=201)
    except Exception as e:
        print(f"Error saving result: {e}")
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def get_result_by_id(request, result_id):
    result = get_object_or_404(Result, id=result_id)
    serializer = ResultSerializer(result)
    return Response(serializer.data)


@api_view(['GET'])
def get_results_by_user(request, user_id):
    results = Result.objects.filter(user=user_id)
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)
