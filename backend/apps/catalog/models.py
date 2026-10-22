from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=['sort_order','name']
        verbose_name_plural="Categories"
    def __str__(self): return self.name
    def save(self,*a,**kw):
        if not self.slug: self.slug=slugify(self.name)
        super().save(*a,**kw)

class Collection(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='collections/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering=['sort_order','title']
    def __str__(self): return self.title
    def save(self,*a,**kw):
        if not self.slug: self.slug=slugify(self.title)
        super().save(*a,**kw)

class Product(models.Model):
    PURITY_CHOICES=[('22KT','22KT'),('18KT','18KT'),('14KT','14KT'),('925 Silver','925 Silver'),('Platinum','Platinum'),('Diamond','Diamond'),('Gemstone','Gemstone')]
    MATERIAL_CHOICES=[('Gold','Gold'),('Diamond','Diamond'),('Silver','Silver'),('Platinum','Platinum'),('Gold & Diamond','Gold & Diamond'),('Gemstone','Gemstone')]
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=300, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    material = models.CharField(max_length=20, choices=MATERIAL_CHOICES, default='Gold')
    purity = models.CharField(max_length=20, choices=PURITY_CHOICES, default='22KT')
    weight_grams = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    dimensions = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    stock = models.IntegerField(default=10)
    care_instructions = models.TextField(blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering=['-created_at']
        indexes=[models.Index(fields=['slug']),models.Index(fields=['is_featured']),models.Index(fields=['is_active'])]
    def __str__(self): return self.name
    def save(self,*a,**kw):
        if not self.slug: self.slug=slugify(self.name)
        super().save(*a,**kw)
    @property
    def discount_percent(self):
        if self.original_price and self.original_price > self.price:
            return round((self.original_price - self.price)/self.original_price*100)
        return 0
    @property
    def in_stock(self): return self.stock>0

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    class Meta:
        ordering=['sort_order','id']

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100) # e.g. Size 6, Rose Gold
    sku = models.CharField(max_length=50, unique=True)
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    attributes = models.JSONField(default=dict, blank=True)
    def __str__(self): return f"{self.product.name} - {self.name}"

class Material(models.Model):
    name=models.CharField(max_length=50, unique=True)
    description=models.TextField(blank=True)
    def __str__(self): return self.name
