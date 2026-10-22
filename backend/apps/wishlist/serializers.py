
from rest_framework import serializers
from .models import Wishlist, WishlistItem
class WishlistItemSerializer(serializers.ModelSerializer):
    product_name=serializers.CharField(source='product.name', read_only=True)
    product_slug=serializers.CharField(source='product.slug', read_only=True)
    product_price=serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image=serializers.SerializerMethodField()
    class Meta:
        model=WishlistItem
        fields=['id','product','product_name','product_slug','product_price','product_image','added_at']
    def get_product_image(self, obj):
        img=obj.product.images.first()
        if img and img.image:
            req=self.context.get('request')
            if req: return req.build_absolute_uri(img.image.url)
            return img.image.url
        return None
class WishlistSerializer(serializers.ModelSerializer):
    items=WishlistItemSerializer(many=True, read_only=True)
    class Meta:
        model=Wishlist
        fields=['id','items','created_at']
