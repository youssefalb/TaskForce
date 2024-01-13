from rest_framework import permissions
from rest_framework import views
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUser, CustomUserSerializer, UserRegistrationSerializer, LoginSerializer
from django.contrib.auth import login
from rest_framework import status
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_framework.authtoken.models import Token  
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        print(request.data)
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = CustomUserSerializer(user)
        print("user ser data",user_serializer.data)
        return Response({'user': user_serializer.data, 'token': token.key}, status=status.HTTP_200_OK)


class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()  
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        user = serializer.save()
        send_verification_email(self.request, user)
        return JsonResponse({"detail": "Verification email sent."}, status=201)

class GoogleLoginView(SocialLoginView):
    authentication_classes = []
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000"
    client_class = OAuth2Client


class GetUserDataView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

class UpdateUserDataView(generics.UpdateAPIView):
    serializer_class = CustomUserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
        
@csrf_exempt
def send_verification_email_view(request, user_id):
    try:
        user = CustomUser.objects.get(pk=user_id)
        print("req",request)
        send_verification_email(request, user)
        return JsonResponse({"detail": "Verification email sent."}, status=200)
    except CustomUser.DoesNotExist:
        return HttpResponse('User not found.', status=404)

@csrf_exempt
def send_verification_email(request, user):
    print("send verification email called")
    print("User",user)
    current_site = get_current_site(request)
    subject = 'Verify your email for our site'
    message = f"""
    Hi {user.username},

    Thanks for signing up for our site! Please complete the verification process by clicking the link below:

    http://127.0.0.1:8000{reverse('activate-account')}?token={default_token_generator.make_token(user)}&uidb64={urlsafe_base64_encode(force_bytes(user.pk))}

    Thanks,
    TaskForce Team
    """
    send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)


def activate_account(request):
    print("activate account called")
    token = request.GET.get('token')
    uidb64 = request.GET.get('uidb64')
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = CustomUser.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.email_verified = True
        user.save()
        return HttpResponse('Email verified successfully!')
    else:
        return HttpResponse('Verification link is invalid!')