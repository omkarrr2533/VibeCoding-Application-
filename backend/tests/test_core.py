
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.catalog.models import Category, Product, Collection

@pytest.mark.django_db
def test_product_list():
    c=Category.objects.create(name="GoldT", slug="goldt", description="test")
    Product.objects.create(name="Test Ring", slug="test-ring", sku="T001", category=c, price=10000, stock=5)
    client=APIClient()
    resp=client.get('/api/v1/products/')
    assert resp.status_code==200
    assert resp.data['count']>=1

@pytest.mark.django_db
def test_search():
    c=Category.objects.create(name="Gold2", slug="gold2", description="test")
    Product.objects.create(name="Searchable Necklace", slug="search-neck", sku="S002", category=c, price=20000, stock=3)
    client=APIClient()
    resp=client.get('/api/v1/search/?q=Searchable')
    assert resp.status_code==200
    assert resp.data['count']==1

@pytest.mark.django_db
def test_auth_register_login():
    client=APIClient()
    resp=client.post('/api/v1/auth/register/', {"username":"testuser","email":"test@test.com","password":"strongpass123","first_name":"Test"}, format='json')
    assert resp.status_code in [200,201]
    resp2=client.post('/api/v1/auth/login/', {"username":"testuser","password":"strongpass123"}, format='json')
    assert resp2.status_code==200
    assert 'access' in resp2.data

@pytest.mark.django_db
def test_cart_flow():
    User=get_user_model()
    u=User.objects.create_user(username='cartuser', email='c@test.com', password='pass12345')
    c=Category.objects.create(name="Gold3", slug="gold3", description="test")
    p=Product.objects.create(name="Cart Ring", slug="cart-ring", sku="C003", category=c, price=5000, stock=10)
    client=APIClient()
    resp=client.post('/api/v1/auth/login/', {"username":"cartuser","password":"pass12345"}, format='json')
    token=resp.data['access']
    client.credentials(HTTP_AUTHORIZATION='Bearer '+token)
    resp=client.post('/api/v1/cart/items/', {"product":p.id, "quantity":2}, format='json')
    assert resp.status_code in [200,201]
    resp=client.get('/api/v1/cart/')
    assert resp.status_code==200
    assert resp.data['total_items']==2
    item_id=resp.data['items'][0]['id']
    resp=client.patch(f'/api/v1/cart/items/{item_id}/', {"quantity":1}, format='json')
    assert resp.status_code==200
    resp=client.post('/api/v1/orders/create/', {"shipping_name":"Test User","shipping_phone":"9999999999","shipping_email":"c@test.com","shipping_address":"123 Street, Pune"}, format='json')
    assert resp.status_code==201
    order_id=resp.data['id']
    resp=client.post('/api/v1/payments/create/', {"order_id":order_id}, format='json')
    assert resp.status_code==200
    assert 'razorpay_order_id' in resp.data

@pytest.mark.django_db
def test_coupon():
    from apps.coupons.models import Coupon
    Coupon.objects.create(code="TEST10", discount_type="percent", discount_value=10, is_active=True)
    client=APIClient()
    resp=client.post('/api/v1/coupons/validate/', {"code":"TEST10","subtotal":10000}, format='json')
    assert resp.status_code==200
    assert resp.data['valid']==True
    assert float(resp.data['discount'])==1000

@pytest.mark.django_db
def test_wishlist():
    User=get_user_model()
    u=User.objects.create_user(username='wishuser', email='w@test.com', password='pass12345')
    c=Category.objects.create(name="GoldW", slug="goldw", description="test")
    p=Product.objects.create(name="Wish Ring", slug="wish-ring", sku="W001", category=c, price=8000, stock=5)
    client=APIClient()
    resp=client.post('/api/v1/auth/login/', {"username":"wishuser","password":"pass12345"}, format='json')
    token=resp.data['access']
    client.credentials(HTTP_AUTHORIZATION='Bearer '+token)
    resp=client.post('/api/v1/wishlist/items/', {"product": p.id}, format='json')
    assert resp.status_code in [200,201]
    resp=client.get('/api/v1/wishlist/')
    assert resp.status_code==200
