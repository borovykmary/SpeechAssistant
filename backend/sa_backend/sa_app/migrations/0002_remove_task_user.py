# Generated by Django 5.1.2 on 2024-11-11 11:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sa_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='user',
        ),
    ]
