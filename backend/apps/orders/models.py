from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES=[('pending','Pending'),('confirmed','Confirmed'),('paid','Paid'),('processing','Processing'),('shipped','Shipped'),('delivered','Delivered'),('cancelled','Cancelled'),('failed','Failed')]
    PAYMENT_STATUS=[('pending','Pending'),('paid','Paid'),('failed','Failed'),('refunded','Refunded')]
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    order_number=models.CharField(max_length=20, unique=True)
    status=models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status=models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')

    subtotal=models.DecimalField(max_digits=10,decimal_places=2)
    discount=models.DecimalField(max_digits=10,decimal_places=2, default=0)
    tax=models.DecimalField(max_digits=10,decimal_places=2, default=0)
    shipping=models.DecimalField(max_digits=10,decimal_places=2, default=0)
    total=models.DecimalField(max_digits=10,decimal_places=2)

    coupon_code=models.CharField(max_length=30, blank=True)

    shipping_name=models.CharField(max_length=120)
    shipping_phone=models.CharField(max_length=20)
    shipping_email=models.EmailField()
    shipping_address=models.TextField()
    billing_address=models.TextField(blank=True)

    tracking_number=models.CharField(max_length=50, blank=True)
    notes=models.TextField(blank=True)

    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        ordering=['-created_at']
        indexes=[models.Index(fields=['user']),models.Index(fields=['order_number'])]

    def __str__(self): return self.order_number

class OrderItem(models.Model):
    order=models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product=models.ForeignKey('catalog.Product', on_delete=models.SET_NULL, null=True)
    variant=models.ForeignKey('catalog.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True)
    product_name=models.CharField(max_length=200)
    sku=models.CharField(max_length=50)
    variant_name=models.CharField(max_length=100, blank=True)
    quantity=models.PositiveIntegerField()
    unit_price=models.DecimalField(max_digits=10,decimal_places=2)
    line_total=models.DecimalField(max_digits=10,decimal_places=2)

class Shipment(models.Model):
    order=models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shipments')
    carrier=models.CharField(max_length=100, blank=True)
    tracking_number=models.CharField(max_length=100, blank=True)
    status=models.CharField(max_length=20, default='pending')
    shipped_at=models.DateTimeField(null=True, blank=True)
    delivered_at=models.DateTimeField(null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
