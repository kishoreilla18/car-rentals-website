"""project1 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.urls import path
from mainapp import views as mainviews
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',mainviews.index,name='index'),
    path('index/',mainviews.index,name='index'),
    path('about/',mainviews.about,name='about'),
    path('contact/',mainviews.contact,name='contact'),
    path('register/',mainviews.register,name='register'),
    path('login/',mainviews.login,name='login'),
    path('userdashboard/',mainviews.userdashboard,name='userdashboard'),
    path('feedback/',mainviews.feedback,name='feedback'),
    path('profile/',mainviews.profile,name='profile'),
    path('adminlogin/',mainviews.adminlogin,name='adminlogin'),
    path('admindashboard/',mainviews.admindashboard,name='admindashboard'),
    path('pendingusers/',mainviews.pendingusers,name='pendingusers'),
    path('update_user_status/<str:username>/<str:status>/',mainviews.update_user_status,name="update_user_status"),
    path('allusers/',mainviews.allusers,name='allusers'),
    path('uploaddata/',mainviews.uploaddata,name='uploaddata'),
    path('viewdata/',mainviews.viewdata,name='viewdata'),
    path('datasetresults/<int:id>/',mainviews.datasetresults,name="datasetresults"),
    path('deletedataset/<int:id>/',mainviews.deletedataset,name="deletedataset"),
    path('dataoverview/',mainviews.dataoverview,name='dataoverview'),
    path('traintest/',mainviews.traintest,name='traintest'),
    path('random/',mainviews.random,name='random'),
    path('ann/',mainviews.ann,name='ann'),
    path('logistic/',mainviews.logistic,name='logistic'),
    path('decision/',mainviews.decision,name='decision'),
    path('algorithmresults/',mainviews.algorithmresults,name='algorithmresults'),
    path('feedbackoverview/',mainviews.feedbackoverview,name='feedbackoverview'),
    path('sentimentanalysis/',mainviews.sentimentanalysis,name="sentimentanalysis"),
    path('sentimentgraph/',mainviews.sentimentgraph,name="sentimentgraph"),
    path('logout/',mainviews.logout,name='logout'),
    path('adminlogout/',mainviews.adminlogout,name='adminlogout'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
