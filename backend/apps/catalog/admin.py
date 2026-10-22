
from django.contrib import admin
from .models import Category, Collection, Product, ProductImage, ProductVariant
class ProductImageInline(admin.TabularInline):
    model=ProductImage
    extra=1
class ProductVariantInline(admin.TabularInline):
    model=ProductVariant
    extra=0
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display=['name','sku','category','price','stock','is_featured','is_active']
    list_filter=['material','purity','is_featured','is_active','category']
    search_fields=['name','sku']
    prepopulated_fields={"slug":("name",)}
    inlines=[ProductImageInline, ProductVariantInline]
admin.site.register(Category)
admin.site.register(Collection)
admin.site.register(ProductVariant)
