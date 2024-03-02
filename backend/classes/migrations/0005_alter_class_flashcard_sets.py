# Generated by Django 4.0.10 on 2023-12-30 04:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('flashcards', '0003_flashcardset_owner'),
        ('classes', '0004_alter_class_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='class',
            name='flashcard_sets',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='classes', to='flashcards.flashcardset'),
        ),
    ]