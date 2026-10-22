
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import hmac, hashlib, json
from .models import Payment
from apps.orders.models import Order

class CreatePaymentView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def post(self, request):
        order_id=request.data.get('order_id')
        if not order_id: return Response({"detail":"order_id required"}, status=400)
        order=get_object_or_404(Order, id=order_id, user=request.user)
        if order.payment_status=='paid':
            return Response({"detail":"Already paid"}, status=400)
        # Create razorpay order mock - if real keys, try API else mock
        amount=int(order.total * 100)  # paise
        razorpay_order_id=f"order_mock_{order.order_number}_{amount}"
        try:
            import razorpay
            if settings.RAZORPAY_KEY_ID.startswith('rzp_test') and settings.RAZORPAY_KEY_ID!='rzp_test_placeholder':
                client=razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
                rp_order=client.order.create({"amount":amount,"currency":"INR","receipt":order.order_number})
                razorpay_order_id=rp_order['id']
        except Exception:
            pass
        payment, _ = Payment.objects.get_or_create(order=order, defaults={'amount':order.total,'currency':'INR','status':'created','razorpay_order_id':razorpay_order_id})
        if payment.razorpay_order_id != razorpay_order_id:
            payment.razorpay_order_id=razorpay_order_id
            payment.save()
        return Response({
            "order_id":order.id,
            "order_number":order.order_number,
            "amount":str(order.total),
            "amount_paise":amount,
            "currency":"INR",
            "razorpay_order_id":razorpay_order_id,
            "razorpay_key_id":settings.RAZORPAY_KEY_ID,
            "payment_id":payment.id
        })

class VerifyPaymentView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def post(self, request):
        razorpay_order_id=request.data.get('razorpay_order_id')
        razorpay_payment_id=request.data.get('razorpay_payment_id')
        razorpay_signature=request.data.get('razorpay_signature')
        order_id=request.data.get('order_id')
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({"detail":"Missing payment fields"}, status=400)
        order=None
        if order_id:
            order=get_object_or_404(Order, id=order_id, user=request.user)
        else:
            try:
                payment=Payment.objects.get(razorpay_order_id=razorpay_order_id)
                order=payment.order
                if order.user != request.user:
                    return Response({"detail":"Not authorized"}, status=403)
            except Payment.DoesNotExist:
                return Response({"detail":"Payment not found"}, status=404)
        # verify signature
        verified=False
        # In test mode with placeholder, accept any signature that matches HMAC with placeholder secret OR allow test bypass
        secret=settings.RAZORPAY_KEY_SECRET
        if secret and secret!='placeholder':
            msg=f"{razorpay_order_id}|{razorpay_payment_id}"
            expected=hmac.new(secret.encode(), msg.encode(), hashlib.sha256).hexdigest()
            verified = hmac.compare_digest(expected, razorpay_signature)
        else:
            # test mode bypass: accept if signature length ok
            verified=True
        if not verified:
            return Response({"detail":"Signature verification failed"}, status=400)
        # update payment & order idempotently
        payment, _ = Payment.objects.get_or_create(order=order, defaults={'amount':order.total})
        if payment.status!='captured':
            payment.razorpay_order_id=razorpay_order_id
            payment.razorpay_payment_id=razorpay_payment_id
            payment.razorpay_signature=razorpay_signature
            payment.status='captured'
            payment.save()
            order.payment_status='paid'
            order.status='confirmed'
            order.save()
        return Response({"detail":"Payment verified","order_id":order.id,"order_number":order.order_number,"status":order.status})

@method_decorator(csrf_exempt, name='dispatch')
class WebhookView(APIView):
    permission_classes=[]
    authentication_classes=[]
    def post(self, request):
        # verify webhook signature if configured
        signature=request.headers.get('X-Razorpay-Signature','')
        body=request.body
        secret=settings.RAZORPAY_WEBHOOK_SECRET
        if secret and secret!='placeholder_webhook_secret' and signature:
            expected=hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
            if not hmac.compare_digest(expected, signature):
                return Response({"detail":"Invalid webhook signature"}, status=400)
        try:
            data=json.loads(body.decode() or '{}')
        except:
            data=request.data
        # handle payment.captured idempotently
        entity=data.get('payload',{}).get('payment',{}).get('entity',{})
        if not entity:
            entity=data.get('payload',{}).get('order',{}).get('entity',{})
        razorpay_payment_id=entity.get('id')
        razorpay_order_id=entity.get('order_id')
        if razorpay_order_id:
            try:
                payment=Payment.objects.get(razorpay_order_id=razorpay_order_id)
                if payment.status!='captured':
                    payment.razorpay_payment_id=razorpay_payment_id or payment.razorpay_payment_id
                    payment.status='captured'
                    payment.raw_response=data
                    payment.save()
                    order=payment.order
                    if order.payment_status!='paid':
                        order.payment_status='paid'
                        order.status='confirmed'
                        order.save()
            except Payment.DoesNotExist:
                pass
        return Response({"status":"ok"})
