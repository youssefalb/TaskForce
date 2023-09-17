from rest_framework import permissions
from rest_framework import views
from rest_framework.response import Response
from rest_framework import generics
from .serializers import CustomUser, UserRegistrationSerializer, LoginSerializer
from django.contrib.auth import login
from rest_framework import status

class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        print(user)
        return Response(None, status=status.HTTP_200_OK)


class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()  
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)
