from django.db import models
from django.conf import settings
from apps.catalog.models import Product, ProductVariant

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='carts')
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        indexes=[models.Index(fields=['user']),models.Index(fields=['session_key'])]

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together=('cart','product','variant')
    @property
    def unit_price(self):
        if self.variant and self.variant.price_override:
            return self.variant.price_override
        return self.product.price
    @property
    def line_total(self):
        return self.unit_price * self.quantity
