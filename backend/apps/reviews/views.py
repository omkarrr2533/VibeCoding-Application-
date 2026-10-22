
from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from apps.catalog.models import Product
from apps.orders.models import OrderItem
class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class=ReviewSerializer
    def get_permissions(self):
        if self.request.method=='POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    def get_queryset(self):
        slug=self.kwargs['slug']
        product=get_object_or_404(Product, slug=slug)
        return Review.objects.filter(product=product, is_approved=True).select_related('user')
    def perform_create(self, serializer):
        slug=self.kwargs['slug']
        product=get_object_or_404(Product, slug=slug)
        # check verified purchase
        verified=False
        if self.request.user.is_authenticated:
            verified=OrderItem.objects.filter(order__user=self.request.user, product=product).exists()
        serializer.save(product=product, user=self.request.user, is_verified_purchase=verified, is_approved=True)

# also generic review list
class AllReviewsView(generics.ListAPIView):
    serializer_class=ReviewSerializer
    queryset=Review.objects.filter(is_approved=True).select_related('user','product')
    permission_classes=[permissions.AllowAny]
