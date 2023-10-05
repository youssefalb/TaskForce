"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from user_auth.views import GetUserDataView, LoginView, UserRegistrationView, GoogleLoginView
from projects.views import ProjectView, ProjectDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', LoginView.as_view()),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('projects/', ProjectView.as_view()),
    path('projects/<int:project_id>/', ProjectDetailView.as_view()),
    path('api/auth/', include('dj_rest_auth.urls')),
    # path('api/social/login/', include('dj_rest_auth.registration.urls')),
    path('api/social/login/google/', GoogleLoginView.as_view(), name='google'),
    path('api/user-data/', GetUserDataView.as_view(), name='get_user_data'),


]