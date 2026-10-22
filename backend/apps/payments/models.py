from django.db import models
from django.conf import settings

class Payment(models.Model):
    STATUS=[('created','Created'),('pending','Pending'),('authorized','Authorized'),('captured','Captured'),('failed','Failed'),('refunded','Refunded')]
    order=models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    razorpay_order_id=models.CharField(max_length=100, blank=True, db_index=True)
    razorpay_payment_id=models.CharField(max_length=100, blank=True, db_index=True)
    razorpay_signature=models.CharField(max_length=255, blank=True)
    amount=models.DecimalField(max_digits=10,decimal_places=2)
    currency=models.CharField(max_length=10, default='INR')
    status=models.CharField(max_length=20, choices=STATUS, default='created')
    raw_response=models.JSONField(default=dict, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self): return f"Payment {self.id} for {self.order.order_number}"
