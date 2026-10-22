
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Coupon
class ValidateCouponView(APIView):
    permission_classes=[]
    def post(self, request):
        code=request.data.get('code','').strip().upper()
        subtotal=float(request.data.get('subtotal',0) or 0)
        try:
            coupon=Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({"valid":False, "detail":"Invalid coupon"}, status=400)
        valid, msg = coupon.is_valid(order_total=subtotal)
        if not valid:
            return Response({"valid":False, "detail":msg}, status=400)
        discount=coupon.calculate_discount(subtotal)
        return Response({"valid":True, "code":coupon.code, "discount":discount, "discount_type":coupon.discount_type, "discount_value":str(coupon.discount_value)})
