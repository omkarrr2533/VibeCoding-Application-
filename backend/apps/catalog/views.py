
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Product, Collection, Category
from .serializers import ProductSerializer, ProductListSerializer, CollectionSerializer, CategorySerializer

class ProductListView(generics.ListAPIView):
    serializer_class=ProductListSerializer
    filter_backends=[DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields=['category__slug','material','purity','is_featured','is_active']
    search_fields=['name','description','sku','material']
    ordering_fields=['price','created_at','name']
    ordering=['-created_at']
    def get_queryset(self):
        qs=Product.objects.filter(is_active=True).select_related('category','collection').prefetch_related('images','variants')
        # custom filters
        category=self.request.query_params.get('category')
        if category:
            qs=qs.filter(category__slug=category)
        collection=self.request.query_params.get('collection')
        if collection:
            qs=qs.filter(collection__slug=collection)
        min_price=self.request.query_params.get('min_price')
        max_price=self.request.query_params.get('max_price')
        if min_price:
            qs=qs.filter(price__gte=min_price)
        if max_price:
            qs=qs.filter(price__lte=max_price)
        in_stock=self.request.query_params.get('in_stock')
        if in_stock=='true':
            qs=qs.filter(stock__gt=0)
        return qs

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class=ProductSerializer
    lookup_field='slug'
    queryset=Product.objects.filter(is_active=True).select_related('category','collection').prefetch_related('images','variants')

class FeaturedProductsView(generics.ListAPIView):
    serializer_class=ProductListSerializer
    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_featured=True).prefetch_related('images')[:12]

class RelatedProductsView(generics.ListAPIView):
    serializer_class=ProductListSerializer
    def get_queryset(self):
        slug=self.kwargs['slug']
        try:
            p=Product.objects.get(slug=slug)
            return Product.objects.filter(category=p.category, is_active=True).exclude(id=p.id).prefetch_related('images')[:6]
        except Product.DoesNotExist:
            return Product.objects.none()

class CollectionListView(generics.ListAPIView):
    serializer_class=CollectionSerializer
    queryset=Collection.objects.filter(is_active=True)

class CollectionDetailView(generics.RetrieveAPIView):
    serializer_class=CollectionSerializer
    lookup_field='slug'
    queryset=Collection.objects.filter(is_active=True)

class CategoryListView(generics.ListAPIView):
    serializer_class=CategorySerializer
    queryset=Category.objects.filter(is_active=True)

@api_view(['GET'])
def search_view(request):
    q=request.query_params.get('q','').strip()
    if not q:
        return Response({"results":[],"count":0})
    qs=Product.objects.filter(is_active=True).filter(Q(name__icontains=q)|Q(description__icontains=q)|Q(sku__icontains=q)|Q(material__icontains=q)).prefetch_related('images')[:20]
    data=ProductListSerializer(qs, many=True).data
    return Response({"results":data,"count":len(data),"query":q})
