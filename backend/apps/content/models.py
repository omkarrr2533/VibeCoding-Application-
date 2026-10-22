from django.db import models

class Announcement(models.Model):
    text=models.CharField(max_length=255)
    is_active=models.BooleanField(default=True)
    link_url=models.CharField(max_length=255, blank=True)
    sort_order=models.IntegerField(default=0)
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=['sort_order','-created_at']

class HomepageSection(models.Model):
    SECTION_TYPES=[('hero','Hero'),('collections','Collections'),('featured','Featured'),('story','Brand Story'),('trust','Trust'),('testimonials','Testimonials'),('cta','CTA')]
    section_type=models.CharField(max_length=20, choices=SECTION_TYPES)
    title=models.CharField(max_length=200, blank=True)
    subtitle=models.CharField(max_length=300, blank=True)
    content=models.TextField(blank=True)
    image=models.ImageField(upload_to='homepage/', blank=True, null=True)
    cta_text=models.CharField(max_length=100, blank=True)
    cta_link=models.CharField(max_length=255, blank=True)
    is_active=models.BooleanField(default=True)
    sort_order=models.IntegerField(default=0)
    metadata=models.JSONField(default=dict, blank=True)
    class Meta: ordering=['sort_order']

class SiteSettings(models.Model):
    site_name=models.CharField(max_length=100, default="Om's Jewellers")
    tagline=models.CharField(max_length=200, blank=True)
    address=models.TextField(blank=True)
    phone=models.CharField(max_length=20, blank=True)
    email=models.EmailField(blank=True)
    business_hours=models.CharField(max_length=100, blank=True)
    social_instagram=models.URLField(blank=True)
    social_facebook=models.URLField(blank=True)
    social_pinterest=models.URLField(blank=True)
    footer_description=models.TextField(blank=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self): return self.site_name

class ContactInquiry(models.Model):
    name=models.CharField(max_length=120)
    email=models.EmailField()
    phone=models.CharField(max_length=20, blank=True)
    subject=models.CharField(max_length=200, blank=True)
    message=models.TextField()
    is_resolved=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)

class CustomJewelleryInquiry(models.Model):
    name=models.CharField(max_length=120)
    email=models.EmailField()
    phone=models.CharField(max_length=20, blank=True)
    budget_range=models.CharField(max_length=50, blank=True)
    description=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

class Testimonial(models.Model):
    name=models.CharField(max_length=100)
    role=models.CharField(max_length=100, blank=True)
    comment=models.TextField()
    rating=models.PositiveSmallIntegerField(default=5)
    product=models.ForeignKey('catalog.Product', on_delete=models.SET_NULL, null=True, blank=True)
    is_approved=models.BooleanField(default=True)
    is_featured=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=['-is_featured','-created_at']

class AuditEvent(models.Model):
    user=models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    action=models.CharField(max_length=100)
    details=models.JSONField(default=dict, blank=True)
    ip_address=models.GenericIPAddressField(null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    class Meta: ordering=['-created_at']
