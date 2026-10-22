from django.db import models
from django.conf import settings

class Review(models.Model):
    product=models.ForeignKey('catalog.Product', on_delete=models.CASCADE, related_name='reviews')
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating=models.PositiveSmallIntegerField(choices=[(1,1),(2,2),(3,3),(4,4),(5,5)])
    title=models.CharField(max_length=150, blank=True)
    comment=models.TextField()
    is_approved=models.BooleanField(default=False)
    is_verified_purchase=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:
        unique_together=('product','user')
        ordering=['-created_at']
