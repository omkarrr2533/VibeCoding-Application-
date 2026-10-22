
from django.urls import path
from .views import ProductReviewListCreateView, AllReviewsView
urlpatterns=[
    path('products/<slug:slug>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('reviews/', AllReviewsView.as_view(), name='reviews'),
]
