# Generated by Django 4.1.3 on 2023-07-20 16:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='project',
        ),
        migrations.RemoveField(
            model_name='task',
            name='users',
        ),
        migrations.DeleteModel(
            name='Project',
        ),
        migrations.DeleteModel(
            name='Task',
        ),
    ]