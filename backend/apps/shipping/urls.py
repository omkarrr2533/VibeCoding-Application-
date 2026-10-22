from django.urls import path
from .views import check_pincode, shipping_rates
urlpatterns=[
    path('shipping/check/', check_pincode, name='shipping-check'),
    path('shipping/rates/', shipping_rates, name='shipping-rates'),
]
