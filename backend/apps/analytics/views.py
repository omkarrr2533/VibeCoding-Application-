from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count
from apps.catalog.models import Product
from apps.orders.models import Order
from apps.accounts.models import User
from apps.newsletter.models import NewsletterSubscription

@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard(request):
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_revenue = Order.objects.filter(payment_status='paid').aggregate(Sum('total'))['total__sum'] or 0
    pending_orders = Order.objects.filter(status='pending').count()
    total_users = User.objects.count()
    subscribers = NewsletterSubscription.objects.filter(is_active=True).count()
    recent_orders = Order.objects.order_by('-created_at')[:5].values('order_number','status','payment_status','total','created_at')
    top_products = Product.objects.filter(is_featured=True).values('name','price','stock')[:5]
    return Response({
        'metrics': {
            'total_products': total_products,
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'pending_orders': pending_orders,
            'total_users': total_users,
            'subscribers': subscribers,
        },
        'recent_orders': list(recent_orders),
        'top_products': list(top_products),
        'note': 'All data is real — derived from database. No fake analytics.'
    })
