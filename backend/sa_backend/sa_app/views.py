from django.shortcuts import render
from django.urls import reverse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer, LoginSerializer, RegisterSerializer
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


@api_view(['GET'])
def check_login(request):
    if request.user.is_authenticated:
        return Response({'logged_in': True}, status=200)
    return Response({'logged_in': False}, status=401)