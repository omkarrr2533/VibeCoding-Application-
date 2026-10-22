
from django.urls import path
from .views import OrderListView, OrderDetailView, OrderCreateView, OrderTrackingView
urlpatterns=[
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/<int:id>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:id>/tracking/', OrderTrackingView.as_view(), name='order-tracking'),
]
