
from django.urls import path
from .views import CartView, CartItemCreateView, CartItemUpdateDeleteView
urlpatterns=[
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/', CartItemCreateView.as_view(), name='cart-items-create'),
    path('cart/items/<int:id>/', CartItemUpdateDeleteView.as_view(), name='cart-items-update'),
]
