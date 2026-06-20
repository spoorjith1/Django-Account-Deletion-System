from django.urls import path
from accounts import views as AccViews
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    #register
    path('register/', AccViews.UserRegisterView.as_view(), name='user_register'),
    
    #login
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    
    #user profile view
    path('profile/me/', AccViews.ProfileView.as_view(), name='user_profile'),
    
    #change password using previous passwword
    path('profile/change-password/', AccViews.PasswordChangeView.as_view(), name='password_change'), 
]