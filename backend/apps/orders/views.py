
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils.crypto import get_random_string
import decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer
from apps.cart.models import Cart
from apps.coupons.models import Coupon, CouponRedemption

class OrderListView(ListAPIView):
    serializer_class=OrderSerializer
    permission_classes=[permissions.IsAuthenticated]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items').order_by('-created_at')

class OrderDetailView(RetrieveAPIView):
    serializer_class=OrderSerializer
    permission_classes=[permissions.IsAuthenticated]
    lookup_field='id'
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

class OrderCreateView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def post(self, request):
        ser=OrderCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data=ser.validated_data
        # get cart
        try:
            cart=Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({"detail":"Cart empty"}, status=400)
        items=cart.items.select_related('product','variant').all()
        if not items.exists():
            return Response({"detail":"Cart empty"}, status=400)
        with transaction.atomic():
            # calculate subtotal
            subtotal=sum(item.line_total for item in items)
            discount=decimal.Decimal('0')
            coupon_code=data.get('coupon_code','').strip().upper()
            coupon=None
            if coupon_code:
                try:
                    coupon=Coupon.objects.get(code__iexact=coupon_code)
                    valid, msg = coupon.is_valid(order_total=subtotal)
                    if not valid:
                        return Response({"detail":msg}, status=400)
                    discount=decimal.Decimal(str(coupon.calculate_discount(float(subtotal))))
                except Coupon.DoesNotExist:
                    return Response({"detail":"Invalid coupon"}, status=400)
            tax = (subtotal - discount) * decimal.Decimal('0.03')  # 3% GST example
            tax=round(tax,2)
            shipping = decimal.Decimal('0') if subtotal>5000 else decimal.Decimal('99')
            total = subtotal - discount + tax + shipping

            order_number='OM' + get_random_string(8, allowed_chars='0123456789').upper()
            # ensure unique
            while Order.objects.filter(order_number=order_number).exists():
                order_number='OM' + get_random_string(8, allowed_chars='0123456789').upper()

            order=Order.objects.create(
                user=request.user,
                order_number=order_number,
                status='pending',
                payment_status='pending',
                subtotal=subtotal,
                discount=discount,
                tax=tax,
                shipping=shipping,
                total=total,
                coupon_code=coupon_code,
                shipping_name=data['shipping_name'],
                shipping_phone=data['shipping_phone'],
                shipping_email=data['shipping_email'],
                shipping_address=data['shipping_address'],
                billing_address=data.get('billing_address',''),
                notes=data.get('notes','')
            )
            for ci in items:
                # check stock again with select_for_update
                prod=ci.product
                prod.refresh_from_db()
                need=ci.quantity
                if ci.variant:
                    var=ci.variant
                    var.refresh_from_db()
                    if var.stock < need:
                        raise transaction.TransactionManagementError("Insufficient variant stock")
                    var.stock -= need
                    var.save()
                else:
                    if prod.stock < need:
                        raise transaction.TransactionManagementError("Insufficient stock")
                    prod.stock -= need
                    prod.save()
                OrderItem.objects.create(
                    order=order,
                    product=prod,
                    variant=ci.variant,
                    product_name=prod.name,
                    sku=ci.variant.sku if ci.variant else prod.sku,
                    variant_name=ci.variant.name if ci.variant else '',
                    quantity=ci.quantity,
                    unit_price=ci.unit_price,
                    line_total=ci.line_total
                )
            # coupon redemption
            if coupon:
                coupon.used_count += 1
                coupon.save()
                CouponRedemption.objects.create(coupon=coupon, user=request.user, order=order)
            # clear cart
            cart.items.all().delete()
            return Response(OrderSerializer(order).data, status=201)

class OrderTrackingView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def get(self, request, id):
        order=get_object_or_404(Order, id=id, user=request.user)
        # simple tracking mock
        steps=[
            {"status":"pending","label":"Order Placed","completed":True},
            {"status":"confirmed","label":"Confirmed","completed": order.status in ['confirmed','paid','processing','shipped','delivered']},
            {"status":"processing","label":"Processing","completed": order.status in ['processing','shipped','delivered']},
            {"status":"shipped","label":"Shipped","completed": order.status in ['shipped','delivered']},
            {"status":"delivered","label":"Delivered","completed": order.status=='delivered'},
        ]
        return Response({"order": OrderSerializer(order).data, "tracking": steps, "tracking_number": order.tracking_number or f"TRK{order.order_number}"})

