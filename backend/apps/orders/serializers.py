
from rest_framework import serializers
from .models import Order, OrderItem
from apps.cart.models import Cart

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderItem
        fields=['id','product','variant','product_name','sku','variant_name','quantity','unit_price','line_total']

class OrderSerializer(serializers.ModelSerializer):
    items=OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model=Order
        fields=['id','order_number','status','payment_status','subtotal','discount','tax','shipping','total','coupon_code','shipping_name','shipping_phone','shipping_email','shipping_address','billing_address','tracking_number','notes','created_at','updated_at','items']
        read_only_fields=['id','order_number','status','payment_status','created_at']

class OrderCreateSerializer(serializers.Serializer):
    shipping_name=serializers.CharField(max_length=120)
    shipping_phone=serializers.CharField(max_length=20)
    shipping_email=serializers.EmailField()
    shipping_address=serializers.CharField()
    billing_address=serializers.CharField(required=False, allow_blank=True)
    coupon_code=serializers.CharField(required=False, allow_blank=True)
    notes=serializers.CharField(required=False, allow_blank=True)
