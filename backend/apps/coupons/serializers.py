
from rest_framework import serializers
from .models import Coupon
class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model=Coupon
        fields=['id','code','description','discount_type','discount_value','min_order_value','max_discount','is_active']
