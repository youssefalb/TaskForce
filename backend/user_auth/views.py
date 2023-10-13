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