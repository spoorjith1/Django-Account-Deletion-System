from django.shortcuts import render
from .models import User
from .serializers import RegisterSerializer, UserProfileSerializer, PasswordChangeSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


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