from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.core.urls')),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.catalog.urls')),
    path('api/v1/', include('apps.cart.urls')),
    path('api/v1/', include('apps.wishlist.urls')),
    path('api/v1/', include('apps.orders.urls')),
    path('api/v1/', include('apps.payments.urls')),
    path('api/v1/', include('apps.reviews.urls')),
    path('api/v1/', include('apps.coupons.urls')),
    path('api/v1/', include('apps.content.urls')),
    path('api/v1/', include('apps.newsletter.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
