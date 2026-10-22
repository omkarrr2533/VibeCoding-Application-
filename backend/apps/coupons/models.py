from django.db import models
from django.conf import settings

class Coupon(models.Model):
    code=models.CharField(max_length=30, unique=True)
    description=models.CharField(max_length=200, blank=True)
    discount_type=models.CharField(max_length=10, choices=[('percent','Percent'),('flat','Flat')], default='percent')
    discount_value=models.DecimalField(max_digits=8,decimal_places=2)
    min_order_value=models.DecimalField(max_digits=10,decimal_places=2, default=0)
    max_discount=models.DecimalField(max_digits=10,decimal_places=2, null=True, blank=True)
    is_active=models.BooleanField(default=True)
    usage_limit=models.IntegerField(null=True, blank=True)
    used_count=models.IntegerField(default=0)
    valid_from=models.DateTimeField(null=True, blank=True)
    valid_until=models.DateTimeField(null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.code
    def is_valid(self, order_total=0):
        if not self.is_active: return False, "Coupon inactive"
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False, "Usage limit reached"
        from django.utils import timezone
        now=timezone.now()
        if self.valid_from and now < self.valid_from: return False, "Not yet valid"
        if self.valid_until and now > self.valid_until: return False, "Expired"
        if order_total < self.min_order_value: return False, f"Min order {self.min_order_value} required"
        return True, "Valid"
    def calculate_discount(self, subtotal):
        from decimal import Decimal
        subtotal = Decimal(str(subtotal))
        if self.discount_type=='percent':
            d = subtotal * (self.discount_value/Decimal('100'))
            if self.max_discount: d = min(d, self.max_discount)
            return round(float(d),2)
        return min(float(self.discount_value), float(subtotal))

class CouponRedemption(models.Model):
    coupon=models.ForeignKey(Coupon, on_delete=models.CASCADE)
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order=models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True)
    redeemed_at=models.DateTimeField(auto_now_add=True)
