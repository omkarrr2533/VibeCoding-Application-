
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Announcement, HomepageSection, SiteSettings, Testimonial
from .serializers import AnnouncementSerializer, HomepageSectionSerializer, SiteSettingsSerializer, ContactSerializer, CustomInquirySerializer, TestimonialSerializer

class AnnouncementListView(generics.ListAPIView):
    serializer_class=AnnouncementSerializer
    permission_classes=[permissions.AllowAny]
    def get_queryset(self):
        return Announcement.objects.filter(is_active=True)

class HomepageView(APIView):
    permission_classes=[permissions.AllowAny]
    def get(self, request):
        sections=HomepageSection.objects.filter(is_active=True)
        data=HomepageSectionSerializer(sections, many=True, context={'request':request}).data
        return Response({"sections":data})

class SiteSettingsView(APIView):
    permission_classes=[permissions.AllowAny]
    def get(self, request):
        obj=SiteSettings.objects.first()
        if not obj:
            obj=SiteSettings.objects.create(site_name="Om's Jewellers", tagline="Where Timeless Elegance Meets Modern Luxury")
        ser=SiteSettingsSerializer(obj)
        return Response(ser.data)

class ContactCreateView(generics.CreateAPIView):
    serializer_class=ContactSerializer
    permission_classes=[permissions.AllowAny]

class CustomInquiryCreateView(generics.CreateAPIView):
    serializer_class=CustomInquirySerializer
    permission_classes=[permissions.AllowAny]

class TestimonialListView(generics.ListAPIView):
    serializer_class=TestimonialSerializer
    permission_classes=[permissions.AllowAny]
    def get_queryset(self):
        return Testimonial.objects.filter(is_approved=True)
