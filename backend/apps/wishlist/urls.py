
from django.urls import path
from .views import WishlistView, WishlistItemCreateView, WishlistItemDeleteView
urlpatterns=[
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/items/', WishlistItemCreateView.as_view(), name='wishlist-create'),
    path('wishlist/items/<int:id>/', WishlistItemDeleteView.as_view(), name='wishlist-delete'),
]
