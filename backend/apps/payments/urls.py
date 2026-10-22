
from django.urls import path
from .views import CreatePaymentView, VerifyPaymentView, WebhookView
urlpatterns=[
    path('payments/create/', CreatePaymentView.as_view(), name='payment-create'),
    path('payments/verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('payments/webhook/', WebhookView.as_view(), name='payment-webhook'),
]
