
from django.urls import path
from .views import health, sitemap, robots
urlpatterns=[
    path('health/', health, name='health'),
    path('sitemap.xml', sitemap, name='sitemap'),
    path('robots.txt', robots, name='robots'),
]
