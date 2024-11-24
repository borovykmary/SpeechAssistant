import os
from django.core.management.base import BaseCommand
from sa_app.models import Task


class Command(BaseCommand):
    help = "Add a new task to the database"

    def add_arguments(self, parser):
        parser.add_argument('--description', type=str, required=True, help="Task description")
        parser.add_argument('--audio', type=str, help="Path to audio sample file")
        parser.add_argument('--text', type=str, help="Text sample")
        parser.add_argument('--emotion', type=str, help="Associated emotion")

    def handle(self, *args, **kwargs):
        description = kwargs['description']
        audio_path = kwargs.get('audio')
        text = kwargs.get('text')
        emotion = kwargs.get('emotion')

        audio_sample = None
        if audio_path:
            # Resolve the path to the audio file relative to this script's directory
            script_dir = os.path.dirname(os.path.abspath(__file__))  # Directory of this script
            resolved_audio_path = os.path.join(script_dir, audio_path)

            # Check if the file exists and read it
            if os.path.exists(resolved_audio_path):
                with open(resolved_audio_path, 'rb') as f:
                    audio_sample = f.read()
                    self.stdout.write("Audio file loaded successfully.")
            else:
                self.stdout.write(f"Audio file not found: {resolved_audio_path}")
                return

        # Create the Task
        task = Task.objects.create(
            task_description=description,
            audio_sample=audio_sample,
            text_sample=text,
            emotion=emotion
        )
        self.stdout.write(f"Task created successfully: {task}")
