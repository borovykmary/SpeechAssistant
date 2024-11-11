from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer

@api_view(['GET'])
def get_all_tasks(request):
    tasks = Task.objects.all()  # Fetch all tasks
    serializer = TaskSerializer(tasks, many=True)  # Serialize data
    return Response(serializer.data)  # Return JSON response