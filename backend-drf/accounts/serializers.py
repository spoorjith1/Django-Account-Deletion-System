from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value
    
    def validate_password(self, value):
        validate_password(value)
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username']


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        user = self.context['request'].user
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        
        if not user.check_password(old_password):
            raise serializers.ValidationError({'old_password': 'Old password is incorrect'})
        
        if old_password == new_password:
            raise serializers.ValidationError({'new_password': 'New password cannot be same as old password'})
        
        validate_password(new_password, user)
        return attrs