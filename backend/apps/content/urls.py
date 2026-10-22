
from django.urls import path
from .views import AnnouncementListView, HomepageView, SiteSettingsView, ContactCreateView, CustomInquiryCreateView, TestimonialListView
urlpatterns=[
    path('announcements/', AnnouncementListView.as_view(), name='announcements'),
    path('homepage/', HomepageView.as_view(), name='homepage'),
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('contact/', ContactCreateView.as_view(), name='contact'),
    path('custom-inquiry/', CustomInquiryCreateView.as_view(), name='custom-inquiry'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonials'),
]
