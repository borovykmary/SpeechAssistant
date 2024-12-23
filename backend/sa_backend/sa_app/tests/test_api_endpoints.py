from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from sa_app.models import User, Task, Result
import os

class APITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='test@example.com', password='password', name='Test User')
        self.task = Task.objects.create(task_description='Test Task')
        self.client.login(email='test@example.com', password='password')

    def test_get_all_tasks(self):
        url = reverse('get_all_tasks')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user(self):
        url = reverse('login_user')
        data = {'email': 'test@example.com', 'password': 'password'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Login successful', response.data['message'])

    def test_login_user_invalid(self):
        url = reverse('login_user')
        data = {'email': 'wrong@example.com', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Login failed', response.data['message'])

    def test_logout_user(self):
        url = reverse('logout_user')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Logout successful', response.data['message'])

    def test_register_user(self):
        url = reverse('register_user')
        data = {'email': 'newuser@example.com', 'password': 'Password123!', 'password2': 'Password123!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('Registration successful', response.data['message'])

    def test_register_user_invalid(self):
        url = reverse('register_user')
        data = {'email': '', 'password': 'newpassword', 'name': 'New User'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Registration failed', response.data['message'])

    def test_landing_page(self):
        url = reverse('landing_page')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Redirection succeeded', response.data['message'])

    '''def test_upload_audio(self):
        url = reverse('upload_audio')
        file_path = os.path.join(os.path.dirname(__file__), 'test_audio.wav')
        with open(file_path, 'rb') as audio_file:
            data = {'task_id': self.task.id, 'audio_file': audio_file}
            response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)'''

    def test_upload_audio_invalid(self):
        url = reverse('upload_audio')
        data = {'task_id': self.task.id}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Task ID and audio file are required', response.data['error'])

    def test_get_all_results(self):
        url = reverse('get_all_results')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_check_login(self):
        url = reverse('check_login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['logged_in'])

    def test_check_login_not_authenticated(self):
        self.client.logout()
        url = reverse('check_login')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data['logged_in'])