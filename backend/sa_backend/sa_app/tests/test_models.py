from django.test import TestCase
from sa_app.models import User, Event, Meditation, Task, Result

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password', name='Test User')

    def test_create_user(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('password'))

    def test_update_user(self):
        self.user.name = 'Updated User'
        self.user.save()
        self.assertEqual(self.user.name, 'Updated User')

    def test_delete_user(self):
        user_id = self.user.id
        self.user.delete()
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(id=user_id)

class EventModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password', name='Test User')
        self.event = Event.objects.create(event_date='2023-01-01', description='Test Event', user=self.user)

    def test_create_event(self):
        self.assertEqual(self.event.description, 'Test Event')

    def test_update_event(self):
        self.event.description = 'Updated Event'
        self.event.save()
        self.assertEqual(self.event.description, 'Updated Event')

    def test_delete_event(self):
        event_id = self.event.id
        self.event.delete()
        with self.assertRaises(Event.DoesNotExist):
            Event.objects.get(id=event_id)

class MeditationModelTest(TestCase):
    def setUp(self):
        self.meditation = Meditation.objects.create(meditation_type='Mindfulness', meditation_description='Test Meditation')

    def test_create_meditation(self):
        self.assertEqual(self.meditation.meditation_type, 'Mindfulness')

    def test_update_meditation(self):
        self.meditation.meditation_description = 'Updated Meditation'
        self.meditation.save()
        self.assertEqual(self.meditation.meditation_description, 'Updated Meditation')

    def test_delete_meditation(self):
        meditation_id = self.meditation.id
        self.meditation.delete()
        with self.assertRaises(Meditation.DoesNotExist):
            Meditation.objects.get(id=meditation_id)

class TaskModelTest(TestCase):
    def setUp(self):
        self.task = Task.objects.create(task_description='Test Task')

    def test_create_task(self):
        self.assertEqual(self.task.task_description, 'Test Task')

    def test_update_task(self):
        self.task.task_description = 'Updated Task'
        self.task.save()
        self.assertEqual(self.task.task_description, 'Updated Task')

    def test_delete_task(self):
        task_id = self.task.id
        self.task.delete()
        with self.assertRaises(Task.DoesNotExist):
            Task.objects.get(id=task_id)

class ResultModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password', name='Test User')
        self.task = Task.objects.create(task_description='Test Task')
        self.result = Result.objects.create(
            recoded_audio=b'Test Audio',
            voice_statistics={"placeholder": "data"},
            ai_response_text='Test AI Response',
            user=self.user,
            task=self.task
        )

    def test_create_result(self):
        self.assertEqual(self.result.ai_response_text, 'Test AI Response')

    def test_update_result(self):
        self.result.ai_response_text = 'Updated AI Response'
        self.result.save()
        self.assertEqual(self.result.ai_response_text, 'Updated AI Response')

    def test_delete_result(self):
        result_id = self.result.id
        self.result.delete()
        with self.assertRaises(Result.DoesNotExist):
            Result.objects.get(id=result_id)