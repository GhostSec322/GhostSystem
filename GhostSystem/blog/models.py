from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from ckeditor.fields import RichTextField


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Post(models.Model):
    STATUS = (("0", "Draft"), ("1", "Publish"))

    feture_image = models.ImageField(upload_to="Images")  # 기본값 추가
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=50)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, null=False, blank=False
    )
    date = models.DateField(auto_now=True)
    content = RichTextField(blank=True, null=True)
    slug = models.SlugField(max_length=500, null=True, blank=True, unique=True)
    status = models.CharField(choices=STATUS, max_length=100)

    def __str__(self):
        return self.title


def create_slug(instance, new_slug=None):
    slug = slugify(instance.title)
    if new_slug is not None:
        slug = new_slug
    qs = Post.objects.filter(slug=slug).order_by("-id")
    exists = qs.exists()
    if exists:
        new_slug = "%s-%s" % (slug, qs.first().id)
        return create_slug(instance, new_slug=new_slug)
    return slug


def pre_save_post_receiver(sender, instance, **kwargs):
    if not instance.slug:
        instance.slug = create_slug(instance)


pre_save.connect(pre_save_post_receiver, Post)


class About(models.Model):
    intro = RichTextField(blank=True, null=True)
