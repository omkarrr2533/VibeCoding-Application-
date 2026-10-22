
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from apps.catalog.models import Product

def get_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    session_key = request.headers.get('X-Session-Key') or request.META.get('HTTP_X_SESSION_KEY')
    if not session_key:
        session_key = request.COOKIES.get('sessionid') or 'anon'
    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart

class CartView(APIView):
    permission_classes=[permissions.AllowAny]
    def get(self, request):
        cart=get_cart(request)
        ser=CartSerializer(cart, context={'request':request})
        return Response(ser.data)

class CartItemCreateView(APIView):
    permission_classes=[permissions.AllowAny]
    def post(self, request):
        cart=get_cart(request)
        product_id=request.data.get('product')
        variant_id=request.data.get('variant')
        quantity=int(request.data.get('quantity',1))
        if quantity<1: return Response({"detail":"Quantity must be >=1"}, status=400)
        product=get_object_or_404(Product, id=product_id, is_active=True)
        if product.stock < quantity:
            return Response({"detail":"Insufficient stock"}, status=400)
        variant=None
        if variant_id:
            from apps.catalog.models import ProductVariant
            variant=get_object_or_404(ProductVariant, id=variant_id, product=product)
            if variant.stock < quantity:
                return Response({"detail":"Variant out of stock"}, status=400)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, variant=variant, defaults={'quantity':quantity})
        if not created:
            item.quantity += quantity
            if product.stock < item.quantity:
                return Response({"detail":"Insufficient stock"}, status=400)
            item.save()
        ser=CartItemSerializer(item, context={'request':request})
        return Response(ser.data, status=201 if created else 200)

class CartItemUpdateDeleteView(APIView):
    permission_classes=[permissions.AllowAny]
    def patch(self, request, id):
        cart=get_cart(request)
        item=get_object_or_404(CartItem, id=id, cart=cart)
        quantity=request.data.get('quantity')
        if quantity is not None:
            quantity=int(quantity)
            if quantity<1: return Response({"detail":"Quantity must be >=1"}, status=400)
            if item.product.stock < quantity: return Response({"detail":"Insufficient stock"}, status=400)
            item.quantity=quantity
            item.save()
        ser=CartItemSerializer(item, context={'request':request})
        return Response(ser.data)
    def delete(self, request, id):
        cart=get_cart(request)
        item=get_object_or_404(CartItem, id=id, cart=cart)
        item.delete()
        return Response(status=204)
