
from rest_framework import serializers
from .models import Cart, CartItem
from apps.catalog.models import Product, ProductVariant

class CartItemSerializer(serializers.ModelSerializer):
    product_name=serializers.CharField(source='product.name', read_only=True)
    product_slug=serializers.CharField(source='product.slug', read_only=True)
    product_sku=serializers.CharField(source='product.sku', read_only=True)
    product_image=serializers.SerializerMethodField()
    unit_price=serializers.ReadOnlyField()
    line_total=serializers.ReadOnlyField()
    variant_name=serializers.CharField(source='variant.name', read_only=True, default=None)
    class Meta:
        model=CartItem
        fields=['id','product','variant','product_name','product_slug','product_sku','product_image','variant_name','quantity','unit_price','line_total']
        read_only_fields=['id']
    def get_product_image(self, obj):
        img=obj.product.images.first()
        if img and img.image:
            request=self.context.get('request')
            if request:
                return request.build_absolute_uri(img.image.url)
            return img.image.url
        return None

class CartSerializer(serializers.ModelSerializer):
    items=CartItemSerializer(many=True, read_only=True)
    subtotal=serializers.SerializerMethodField()
    total_items=serializers.SerializerMethodField()
    class Meta:
        model=Cart
        fields=['id','items','subtotal','total_items','created_at','updated_at']
    def get_subtotal(self, obj):
        return sum(item.line_total for item in obj.items.all())
    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())
