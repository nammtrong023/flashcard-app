# Generated by Django 4.0.10 on 2023-12-05 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='onetimepassword',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
