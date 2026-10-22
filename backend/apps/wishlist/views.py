
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer, WishlistItemSerializer
from apps.catalog.models import Product
class WishlistView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def get(self, request):
        wl, _ = Wishlist.objects.get_or_create(user=request.user)
        ser=WishlistSerializer(wl, context={'request':request})
        return Response(ser.data)

class WishlistItemCreateView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def post(self, request):
        product_id=request.data.get('product') or request.data.get('product_id')
        if not product_id: return Response({"detail":"product required"}, status=400)
        product=get_object_or_404(Product, id=product_id)
        wl, _ = Wishlist.objects.get_or_create(user=request.user)
        item, created = WishlistItem.objects.get_or_create(wishlist=wl, product=product)
        if not created:
            return Response({"detail":"Already in wishlist"}, status=200)
        ser=WishlistItemSerializer(item, context={'request':request})
        return Response(ser.data, status=201)

class WishlistItemDeleteView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def delete(self, request, id):
        wl=get_object_or_404(Wishlist, user=request.user)
        item=get_object_or_404(WishlistItem, id=id, wishlist=wl)
        item.delete()
        return Response(status=204)
