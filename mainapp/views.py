from django.shortcuts import render,redirect
from django.contrib import messages
from mainapp.models import *
from datetime import datetime
import csv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from django.db.models import Count
from .models import Feedback

# Create your views here.
def index(request):
    return render(request,'index.html')

def about(request):
    return render(request,'about.html')

def contact(req): 
    if req.method == "POST": 
        name = req.POST.get("name") 
        email = req.POST.get("email") 
        subject = req.POST.get("subject") 
        message = req.POST.get("message") 
        if not name or not email or not subject or not message: 
            messages.warning(req, "Enter all the fields to continue") 
            return render(req, 'contact.html') 
        Contact.objects.create( 
            Full_Name=name, Email_Address=email, Subject=subject, Message=message 
        ) 
        messages.success(req, "Your message has been submitted successfully.") 
    return render(req,"contact.html") 

def register(req): 

    if req.method == "POST": 
        fullname = req.POST.get("username") 
        email = req.POST.get("useremail") 
        password = req.POST.get("userpassword")  
        address = req.POST.get("address") 
        phone = req.POST.get("phno")
        userimage = req.FILES['userimage']
        imagedata = userimage.read()

        print(type(userimage))
        if not fullname or not email or not password or not address or not phone: 
            print('hello')
            messages.warning(req, "Enter all the fields to continue") 
            return render(req, 'signinpage.html')
        try: 
            data = UserModel.objects.get(user_email=email) 
            messages.warning( 
                req, "Email was already registered, choose another email..!" 
            ) 
            print('hyy')
            return redirect("register") 
        except:
            print('hii')
            UserModel.objects.create( 
                user_name=fullname, 
                user_email=email, 
                user_contact=phone, 
                user_address=address,
                user_password=password,
                user_image=userimage,  
            ) 
            user = UserModel.objects.get(user_email=email)
            print(user.user_id)
            req.session["user_id"] = user.user_id 
            messages.success(req, "Your account was created..") 
            return redirect("login") 
    print(req.method) 
    return render(req, "signinpage.html") 

def login(req): 
    if req.method == "POST": 
        user_email = req.POST.get("email") 
        user_password = req.POST.get("password") 
        
        if not user_email or not user_password: 
            messages.warning(req, "Enter all the fields to continue") 
            return render(req, 'login.html') 
 
        try: 
            users_data = UserModel.objects.filter(user_email=user_email)
            if not users_data.exists(): 
                messages.error(req, "User does not exist") 
                return redirect("login") 
 
            for user_data in users_data: 
                if user_data.user_password == user_password:
                    if user_data.status=="pending":
                        messages.info(req,"your account is pending.")
                        return render(req, "login.html")
                    elif user_data.status=="rejected":
                        messages.info(req,"your account is rejected.")
                        return render(req, "login.html")
                    
                    req.session["user_email"] = user_data.user_email
                    messages.success(req, "You are logged in..")  
                    user_data.save() 
                    return redirect("userdashboard")  
                else: 
                    messages.error(req, "Incorrect credentials...!") 
                    return redirect("login") 
 
            messages.error(req, "Incorrect credentials...!") 
            return redirect("login") 
        
        except Exception as e: 
            print(e) 
            messages.error(req, "An error occurred. Please try again later.") 
            return redirect("login") 
    
    return render(req, "login.html")


def userdashboard(request):
    email = request.session.get("user_email")
    user = UserModel.objects.get(user_email=email)
    name = user.user_name
    return render(request,'userdashboard.html',{"name":name})



def feedback(req): 
    email = req.session["user_email"]  
    user = UserModel.objects.get(user_email=email) 
    if req.method == "POST": 
        stars = req.POST.get("stars") 
        review = req.POST.get("review") 
        rating = int(stars)
        if not rating or not review: 
            messages.warning(req, "Enter all the fields to continue!") 
            return render (req, "feedback.html") 
        sid = SentimentIntensityAnalyzer() 
        score = sid.polarity_scores(review) 
        sentiment = None 
        if score["compound"] > 0 and score["compound"] <= 0.5: 
            sentiment = "positive" 
        elif score["compound"] >= 0.5: 
            sentiment = "very positive" 
        elif score["compound"] < -0.5: 
            sentiment = "negative" 
        elif score["compound"] < 0 and score["compound"] >= -0.5: 
            sentiment = " very negative" 
        else: 
            sentiment = "neutral" 
        Feedback.objects.create( 
            Rating=rating, Review=review, Sentiment=sentiment, Reviewer=email 
        ) 
        messages.success(req, "Feedback recorded") 
        return redirect("feedback") 
    return render(req, "feedback.html", {"user": user}) 

def profile(req): 
    email = req.session.get("user_email") 
    if not email: 
        messages.error(req, "User not logged in.") 
        return redirect("login") 
 
    user = UserModel.objects.get(user_email=email)
    print(user.user_image)
 
    if req.method == "POST":
        user.user_name = req.POST.get("user_name")  
        user.user_contact = req.POST.get("user_contact") 
        user.user_email = req.POST.get("user_email") 
        user.user_address = req.POST.get("address")

        if req.FILES.get('userimage'):
            user.user_image = req.FILES['userimage']

        user.save()
        messages.success(req, "Profile updated successfully.") 
        return render(req, "profile.html", {"user": user})

    return render(req, "profile.html", {"user": user})


def logout(req): 
    if "user_email" in req.session: 
        view = req.session["user_email"] 
        try: 
            user = UserModel.objects.get(user_email=view) 
            # user.Last_Login_Time = timezone.now().time() 
            # user.Last_Login_Date = timezone.now().date() 
            # user.save() 
            messages.info(req, "You are logged out.") 
        except UserModel.DoesNotExist: 
            pass 
    req.session.flush() 
    return redirect("login") 

def adminlogout(req):
    messages.info(req, "You are logged out.") 
    return redirect("adminlogin")

def adminlogin(req): 
    admin_name = "admin" 
    admin_pwd = "admin" 
    if req.method == "POST": 
        admin_n = req.POST.get("username") 
        admin_p = req.POST.get("password") 
        if not admin_n or not admin_p: 
            messages.warning(req, "Enter all the fields to continue") 
            return render(req, 'adminlogin.html') 
        if admin_n == admin_name and admin_p == admin_pwd: 
            messages.success(req, "You are logged in..") 
            return redirect("admindashboard") 
        else: 
            messages.error(req, "You are trying to login with wrong details..") 
            return redirect("adminlogin") 
    return render(req,"adminlogin.html")

def admindashboard(request):
    users = UserModel.objects.all().order_by('-user_id')[:5]
    rejected_count = UserModel.objects.filter(status="rejected").count()
    accepted_count = UserModel.objects.filter(status="accepted").count()
    pending_count = UserModel.objects.filter(status="pending").count()
    feedback_count = Feedback.objects.all().count()

    return render(request,'admindashboard.html', {"users":users, "rejected_count": rejected_count, "accepted_count": accepted_count, "pending_count": pending_count, "feedback_count": feedback_count})

def pendingusers(req):
    users = UserModel.objects.filter(status="pending")
    return render(req,"pendingusers.html", {"users":users})

def update_user_status(req,username,status):
    if status=="accept":
        UserModel.objects.filter(user_name=username).update(status="accepted")
    elif status=="reject":
        UserModel.objects.filter(user_name=username).update(status="rejected")
    return redirect("pendingusers")

def allusers(req):
    users = UserModel.objects.all().order_by("datetime")   # latest first

    # Pagination (5 per page)
    paginator = Paginator(users, 5)  
    page_number = req.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(req, "allusers.html", {"page_obj": page_obj})

def uploaddata(request):
    if request.method == 'POST':
        file = request.FILES['file']
        file_size = file.size  # File size is already in bytes
        file_type = file.name.split('.')[-1].upper() # auto detect type

        # Ensure user is included (assuming user is logged in)
        UploadDatasetModel.objects.create(
            file_size=file_size,  # Store file size in bytes
            dataset=file,
            file_type=file_type,
        )

        messages.success(request, 'Your dataset was uploaded successfully.')
    
    return render(request, "uploaddataset.html")


import pandas as pd

def viewdata(req):
    dataset = UploadDatasetModel.objects.all()
    return render(req, "viewdataset.html",{"dataset":dataset})

def datasetresults(request, id):
    data = UploadDatasetModel.objects.get(s_no=id)  # Get the latest uploaded dataset
    if not data:
        messages.error(request, "No dataset found.")
        return redirect('viewdata')

    file_path = data.dataset.path  # Correctly get the file path
    
    try:
        df = pd.read_csv(file_path, nrows=50)  # Load only the first 50 rows
        table = df.to_html(classes="table table-bordered", table_id="data_table")  # Add styling for better UI
    except Exception as e:
        messages.error(request, f"Error reading file: {e}")
        return redirect('viewdata')

    return render(request, "datasetresults.html", {'t': table})

def deletedataset(req, id):
    UploadDatasetModel.objects.get(s_no=id).delete()
    messages.success(req, 'dataset was deleted successfully.')
    return redirect('viewdata')

def dataoverview(req):
    return render(req, "dataoverview.html")

def traintest(req):
    return render(req, "traintestsplit.html")

def random(req):
    return render(req,"randomforest.html")

def ann(req):
    return render(req,"ann.html")

def logistic(req):
    return render(req,"logistic.html")

def decision(req):
    return render(req,"decision.html")

def algorithmresults(req):
    return render(req, "algorithmresults.html")

# def feedbackoverview(req):
#     reviews = Feedback.objects.all()
#     return render(req,"feedbackoverview.html",{"reviews":reviews})
from django.core.paginator import Paginator

def feedbackoverview(req):
    reviews = Feedback.objects.all().order_by("-datetime")   # latest first

    # Pagination (5 per page)
    paginator = Paginator(reviews, 5)  
    page_number = req.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(req, "feedbackoverview.html", {"page_obj": page_obj})


def sentimentanalysis(req):
    reviews = Feedback.objects.all().order_by("-datetime")   # latest first
    
    # Pagination (5 per page)
    paginator = Paginator(reviews, 5)  
    page_number = req.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return render(req, "sentimentanalysis.html", {"page_obj": page_obj})

def sentimentgraph(req):
    # Count how many feedbacks per sentiment
    sentiment_data = Feedback.objects.values("Sentiment").annotate(count=Count("Sentiment"))
    print(sentiment_data)
    # Prepare dictionary for all sentiments
    sentiment_counts = {
    "very_positive": Feedback.objects.filter(Sentiment="very positive").count(),
    "positive": Feedback.objects.filter(Sentiment="positive").count(),
    "neutral": Feedback.objects.filter(Sentiment="neutral").count(),
    "negative": Feedback.objects.filter(Sentiment="negative").count(),
    "very_negative": Feedback.objects.filter(Sentiment="very negative").count(),
}

    # Fill the dictionary with DB counts
    # for item in sentiment_data:
    #     sentiment = item["Sentiment"].lower().strip()
    #     if sentiment in sentiment_counts:
    #         sentiment_counts[sentiment] = item["count"]
    # print(sentiment_counts)
    # Pass to frontend
    return render(req, "sentimentgraph.html", {"sentiment_counts": sentiment_counts})

