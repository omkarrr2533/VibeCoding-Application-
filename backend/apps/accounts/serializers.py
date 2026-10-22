
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Address, CustomerProfile
User=get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name','phone','password']
        extra_kwargs={'email':{'required':True}}
    def validate_email(self, v):
        if User.objects.filter(email__iexact=v).exists():
            raise serializers.ValidationError("Email already registered")
        return v
    def create(self, validated_data):
        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name',''),
            last_name=validated_data.get('last_name',''),
            phone=validated_data.get('phone','')
        )
        CustomerProfile.objects.get_or_create(user=user)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','first_name','last_name','phone','is_verified','date_joined']
        read_only_fields=['id','date_joined']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields='__all__'
        read_only_fields=['user','created_at']
