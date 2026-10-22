
from rest_framework import serializers
from .models import Announcement, HomepageSection, SiteSettings, ContactInquiry, Testimonial, CustomJewelleryInquiry
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model=Announcement
        fields='__all__'
class HomepageSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=HomepageSection
        fields='__all__'
class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model=SiteSettings
        fields='__all__'
class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model=ContactInquiry
        fields=['id','name','email','phone','subject','message','created_at']
        read_only_fields=['id','created_at']
class CustomInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomJewelleryInquiry
        fields=['id','name','email','phone','budget_range','description','created_at']
        read_only_fields=['id','created_at']
class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model=Testimonial
        fields=['id','name','role','comment','rating','is_featured','created_at']
