from django.db import models
class NewsletterSubscription(models.Model):
    email=models.EmailField(unique=True)
    is_active=models.BooleanField(default=True)
    consent_given=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.email
