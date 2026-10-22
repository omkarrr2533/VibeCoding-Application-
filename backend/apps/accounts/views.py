
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RegisterSerializer, UserSerializer, AddressSerializer
from .models import Address
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

User=get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[AllowAny]

class LoginView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        username=request.data.get('username')
        email=request.data.get('email')
        password=request.data.get('password')
        user=None
        if email and not username:
            try:
                u=User.objects.get(email__iexact=email)
                username=u.username
            except User.DoesNotExist:
                pass
        if username and password:
            user=authenticate(username=username, password=password)
        if not user:
            return Response({"detail":"Invalid credentials"}, status=400)
        refresh=RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })

class MeView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        return Response(UserSerializer(request.user).data)
    def patch(self, request):
        ser=UserSerializer(request.user, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

class LogoutView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        try:
            refresh_token=request.data.get('refresh')
            if refresh_token:
                token=RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass
        return Response({"detail":"Logged out"})

class PasswordResetView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        # Demo: just acknowledge, no email send in test
        return Response({"detail":"If email exists, reset link sent."})

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class=AddressSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=AddressSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
