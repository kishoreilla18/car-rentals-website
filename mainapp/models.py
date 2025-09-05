from django.db import models 
import datetime

# Create your models here. 
class UserModel(models.Model):
    user_id = models.AutoField(primary_key=True) 
    user_name = models.CharField(help_text="user_name", max_length=50)  
    user_email = models.EmailField(help_text="user_email", unique=True) 
    user_password = models.EmailField(help_text="user_password", max_length=50) 
    user_address = models.TextField(help_text="user_address", max_length=100)  
    user_contact = models.CharField(help_text="user_contact", max_length=15, null=True) 
    user_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    datetime = models.DateTimeField(auto_now=True)   
    STATUS_CHOISES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOISES, default='pending')
    class Meta: 
        db_table = "user_details" 


class Feedback(models.Model): 
    Feed_id = models.AutoField(primary_key=True) 
    Rating = models.CharField(max_length=100, null=True) 
    Review = models.CharField(max_length=225, null=True) 
    Sentiment = models.CharField(max_length=100, null=True) 
    Reviewer = models.EmailField(help_text="user_email", unique=True) 
    datetime = models.DateTimeField(auto_now=True) 
 
    class Meta: 
        db_table = "feedback_details" 


class Contact(models.Model): 
    Full_Name = models.CharField(help_text="Full_name", max_length=50) 
    Email_Address = models.EmailField(help_text="Email") 
    Subject = models.CharField(help_text="Subject", max_length=50) 
    Message = models.CharField(help_text="Message", max_length=50) 
 
    class Meta: 
        db_table = "Contact" 

class UploadDatasetModel(models.Model):
    s_no = models.AutoField(primary_key = True)   # MongoDB's default primary key
    dataset = models.FileField(upload_to='')  
    file_size = models.PositiveIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'upload_dataset'


