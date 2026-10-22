
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .serializers import NewsletterSerializer
from .models import NewsletterSubscription
class SubscribeView(generics.CreateAPIView):
    serializer_class=NewsletterSerializer
    permission_classes=[permissions.AllowAny]
    def create(self, request, *args, **kwargs):
        email=request.data.get('email','').strip().lower()
        if not email: return Response({"detail":"Email required"}, status=400)
        if NewsletterSubscription.objects.filter(email__iexact=email).exists():
            return Response({"detail":"Already subscribed","email":email}, status=200)
        serializer=self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)
