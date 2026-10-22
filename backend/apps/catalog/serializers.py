
from rest_framework import serializers
from .models import Category, Collection, Product, ProductImage, ProductVariant

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductImage
        fields=['id','image','alt_text','is_primary','sort_order']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductVariant
        fields=['id','name','sku','price_override','stock','is_active','attributes']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=['id','name','slug','description','image','is_active','sort_order']

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Collection
        fields=['id','title','slug','description','short_description','image','is_featured','is_active','sort_order']

class ProductSerializer(serializers.ModelSerializer):
    images=ProductImageSerializer(many=True, read_only=True)
    variants=ProductVariantSerializer(many=True, read_only=True)
    category=CategorySerializer(read_only=True)
    collection=CollectionSerializer(read_only=True)
    discount_percent=serializers.ReadOnlyField()
    in_stock=serializers.ReadOnlyField()
    class Meta:
        model=Product
        fields=['id','name','slug','sku','description','short_description','category','collection','material','purity','weight_grams','dimensions','price','original_price','is_featured','is_active','stock','care_instructions','specifications','images','variants','discount_percent','in_stock','created_at','updated_at']

class ProductListSerializer(serializers.ModelSerializer):
    images=ProductImageSerializer(many=True, read_only=True)
    discount_percent=serializers.ReadOnlyField()
    in_stock=serializers.ReadOnlyField()
    category_name=serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model=Product
        fields=['id','name','slug','sku','price','original_price','material','purity','category','category_name','is_featured','stock','discount_percent','in_stock','images']
