# Generated by Django 5.1.4 on 2025-01-20 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0013_remove_post_main_content_alter_tag_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
