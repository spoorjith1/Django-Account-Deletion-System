from django.shortcuts import render
from .models import User
from .serializers import RegisterSerializer, UserProfileSerializer, PasswordChangeSerializer, CustomTokenObtainPairSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView


class UserRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    

class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()
    
    def get_object(self):
        return self.request.user


#password change using previous password
class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
#delete account
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        
        if user.is_deleted:
            return Response({'message': 'Account is already scheduled for deletion'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_deleted = True
        user.deletion_date = timezone.now() + timedelta(days=30)
        user.save()
        
        return Response({'message': 'Account schedule for deletion'}, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RestoreAccountView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message': 'user not found'}, status=404)
        user.is_deleted = False
        user.deletion_date = None
        user.save()
        return Response({'message': 'Account restored successfully'})