
from django.urls import path
from .views import ProductListView, ProductDetailView, FeaturedProductsView, RelatedProductsView, CollectionListView, CollectionDetailView, CategoryListView, search_view
urlpatterns=[
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/featured/', FeaturedProductsView.as_view(), name='product-featured'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<slug:slug>/related/', RelatedProductsView.as_view(), name='product-related'),
    path('collections/', CollectionListView.as_view(), name='collection-list'),
    path('collections/<slug:slug>/', CollectionDetailView.as_view(), name='collection-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('search/', search_view, name='search'),
]
