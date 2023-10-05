from django.contrib.auth import authenticate

from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('user_id', 'email', 'username','is_staff', 'is_active', 'date_joined', 'role', 'first_name', 'last_name','image', 'sex')
        extra_kwargs = {'password': {'write_only': True}}


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser 
        fields = ['user_id', 'email','username', 'password', 'role', 'first_name', 'last_name', 'image', 'sex'] 
        extra_kwargs = {'password': {'write_only': True},
                        'role': {'required': False}}

    def create(self, validated_data):
        role = validated_data.pop('role', 'Guest')
        user = CustomUser.objects.create_user(role=role, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        label="Username",  
        write_only=True 
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    role = serializers.CharField(
        source='user.role', 
        read_only=True 
    )


    def validate(self, attrs):
        username = attrs.get('username')  
        password = attrs.get('password')
        print("username", username)
        print("password", password)

        if username and password:  
            user = authenticate(
                request=self.context.get('request'),
                username=username, 
                password=password
            )
            if not user:
                msg = 'Access denied: wrong email or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "email" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        attrs['user'] = user
        return attrs
