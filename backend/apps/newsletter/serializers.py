
from rest_framework import serializers
from .models import NewsletterSubscription
class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model=NewsletterSubscription
        fields=['id','email','consent_given','created_at']
        read_only_fields=['id','created_at']
