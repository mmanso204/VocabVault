from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, QueryDict
from django.core.exceptions import ValidationError
from django.contrib import messages
from django.utils import timezone

from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from django.http import HttpResponse
from .models import FavoriteWord


def user_register(request):
    '''
    Takes in HTTP request send by the frontend, returns appropriate HTTP response in JSON
    '''
    if request.method == 'POST': 
        # If POST request, process the form data to register the user
        
        # Django's built-in UserCreationForm to handle user registration.
        form = UserCreationForm(request.POST) # validates input data (ensuring info meets criteria)
        
        if form.is_valid():
            # If the form fields meet the criteria, proceed to create a new user 
            
            # Extract username and password from cleaned_data dictionary attribute
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            email = request.POST.get('email')
            profile_picture = request.FILES.get('profile_picture')
            
            try:
                # Create a new user instance and save it to the database
                new_user = User.objects.create_user(username=username, password=password, email=email)
                new_user.save()
                
                # Now create a UserProfile instance
                new_profile = UserProfile(user=new_user, profile_picture=profile_picture)
                new_profile.save()
                
                # Return a HTTP response with status code 201 for "Created" 
                return JsonResponse({'username': new_user.username, 'id': new_user.id},  status=201)
            except ValidationError as e:
                # Handle validation errors from user creation (e.g. already existing username)
                # Return a 400 Bad Request status code and a message explaining the error
                
                return JsonResponse({'error': e.messages[0]}, status=400)
        else:
            # If the form fields don't meet the criteria, send HTTP response with status code 401 ("Bad request")
            # containing the errors
        
            # Create a dictionary with field-json serializable error (key-values) using dictiınary comprehension
            errors = {field: error.get_json_data() for field, error in form.errors.items()}
            return JsonResponse({'errors': errors}, status=400)
    else: 
        # If the request.method == 'GET', render the page with empty form
        
        form = UserCreationForm() 
        # Indicate the template and pass the empty form as context
        return render(request, 'userregisterpage.html', {'form': form})
        
def user_login(request):
    """
    Handle user login requests. Takes in HTTP request, returns appropriate HTTP response in JSON
    """
    if request.method == 'POST':
        # If POST request, process the form data to log in the user
        
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Verify username and password. User object is returned if credentials are valid, o/w None
        user = authenticate(request, username=username, password=password)        
        if user is not None:
            login(request, user) # Creates a session handled by Django
            
            # Return a HTTP response indicating success
            return JsonResponse({'success': True, 'message': 'You have successfully logged in.', 'username': username}, status=200) 
        else:
            # Return a HTTP response indicating failure
            return JsonResponse({'success': False, 'error': 'Invalid username or password.'}, status=400)
        
    elif request.method == 'GET':
        # If GET request, display the login page 
        
        # Indicate the template to be rendered
        return render(request, 'userloginpage.html')


def user_logout(request):
    '''
    Handle user logout request. Considering its simplicity, it is preferred to be implemented in the backend
    with traditional flow and redirection.
    '''
    # Invalidates the user's session. Django deletes the session data and instructs the browser to delete the session cookie
    logout(request)
    return redirect('/homepage')

@login_required
@csrf_exempt
def update_user_info(request):
    """
    Updates user's username, email, and profile picture on POST request.

    Expects 'username', 'email', and 'profile_pic' in POST data. On success, returns a JsonResponse
    indicating success. On failure, returns a JsonResponse with an error message.

    Parameters:
    - request (HttpRequest): The request object with POST data and files.

    Returns:
    - JsonResponse: Indicates success or failure of the update.
    """
    if request.method == 'POST':
        # Django doesn't handle PUT data natively, so we manually parse it
        new_username = request.POST.get('username')
        new_email = request.POST.get('email')
        new_profile_pic = request.FILES.get('profile_pic')
        
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        
        try:
            if new_username:
                user.username = new_username
            if new_email:
                user.email = new_email
            if new_profile_pic:
                user_profile.profile_picture = new_profile_pic
            
            user.save()
            user_profile.save()
            
            return JsonResponse({'success' : True}, status=200)
        except ValidationError as e:
            return JsonResponse({'error': e.messages}, status=400)
    else:
        return JsonResponse({'error:' 'Invalid request method'}, status=405)
        

def delete_favorite(request, favorite_id):
    """
    This function deletes the words that the user has stored as favorite. It filters throught the favoritewords model with the word id provided in the website and then redirect the user back to the page.

    parameters:
    request (HttpRequest): The HTTP request object containing metadata about the request.

    returns:
    HttpResponse: A redirect to the favorites page or a it passes and the redirects

    """
    if request.method == 'POST':
        try:
            favorite = FavoriteWord.objects.get(id=favorite_id)
            favorite.delete()  # Delete the favorite word
        except FavoriteWord.DoesNotExist:
            # Handle case where the favorite word does not exist
            pass
    return redirect('favorites_page')  #

def show_favorites(request):
    """
    This function shows the words that the user has stored as favorite. It filters throught the favoritewords model with the user id and then sends the words it has to the page that it renders.
    it is a secondary show favorites function for if the primary on doesnt. it switches from sending the dictionary with favorites words in the request to sending it as a variable

    parameters:
    request (HttpRequest): The HTTP request object containing metadata about the request.

    returns:
    HttpResponse: A redirect to the favorites page or a 404 response if the word does not exist.

    """
    
    if request.user.is_authenticated:
        # Filter favorites for the currently logged-in user
        user_favorites = FavoriteWord.objects.filter(user=request.user)

        # Pass the user-specific favorites to the template for display
        context = {
            'user_favorites': user_favorites
        }
        return render(request, 'FavoritesPage.html', context)
    else:
        # Handle the case when the user is not authenticated (e.g., redirect to login)
        return render(request, 'userloginpage.html')


def show_favorite_words(request):
    """
    This function shows the words that the user has stored as favorite. It filters throught the favoritewords model with the user id and then sends the words it has to the page that it renders.

    parameters:
    request (HttpRequest): The HTTP request object containing metadata about the request.

    returns:
    HttpResponse: A redirect to the favorites page or a 404 response if the word does not exist.

    """
    if request.user.is_authenticated:
        # Filter favorites for the currently logged-in user
        user_favorites = FavoriteWord.objects.filter(user=request.user)

        # Print a message to log the number of favorite words for the user
        print(f"Number of favorite words for user {request.user}: {user_favorites.count()}")

        # Pass the user-specific favorites to the template for display
        context = {
            'user_favorites': user_favorites
        }
        return render(request, 'FavoritesPage.html', {'favorite_words': user_favorites})
    else:
        # Print a message to log that the user is not authenticated
        print("User is not authenticated. Redirecting to login page.")

        # Handle the case when the user is not authenticated (e.g., redirect to login)
        return render(request, 'userloginpage.html')

def edit_favorite(request, favorite_id):
    """
    This function handles the editing of a favorite word entry identified by its ID. If the request method is POST,
    it retrieves the favorite word, updates its fields with the new values from the form data, and saves the changes.
    It then redirects the user to the homepage. If the favorite word does not exist, it returns a 404 response.

    Parameters:
    request (HttpRequest): The HTTP request object containing metadata about the request.
    favorite_id (int): The ID of the favorite word to be edited.

    Returns:
    HttpResponse: A redirect to the homepage or a 404 response if the favorite word does not exist.
    """
    if request.method == 'POST':
        # Retrieve the FavoriteWord object based on the favorite_id
        try:
            favorite_word = FavoriteWord.objects.get(id=favorite_id)
        except FavoriteWord.DoesNotExist:
            return HttpResponse("Favorite entry not found.", status=404)

        # Process the form data to update the favorite entry
        form_data = request.POST
        favorite_word.field_name = form_data.get('field_name', favorite_word.field_name)  # Update the field with the new value

        # Save the updated favorite entry
        favorite_word.save()

        # Redirect to a success page or a different URL after editing
        return redirect('/homepage')  # Redirect to a success page

    return HttpResponse("Method not allowed", status=405)  # Return if the method is not allowed

from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse
from .models import FavoriteWord


def edit_word(request, word_id):  # Ensure the parameter name matches the URL pattern
    """
    This function handles the editing of a word entry identified by its ID. If the request method is POST, it retrieves
    the word, updates its fields with the new values from the form data, and saves the changes. It then redirects the
    user to the favorites page. If the word does not exist, it returns a 404 response.

    Parameters:
    request (HttpRequest): The HTTP request object containing metadata about the request.
    word_id (int): The ID of the word to be edited.

    Returns:
    HttpResponse: A redirect to the favorites page or a 404 response if the word does not exist.
    """
    word = get_object_or_404(FavoriteWord, id=word_id)
    
    if request.method == 'POST':
        # Handle form submission to update the word and meaning fields
        word.word = request.POST.get('word')
        word.meaning = request.POST.get('meaning')
        word.save()
        
        # Redirect to a success page or back to the favorites page
        return redirect('favorites')  # Replace with your favorites URL name
    
    return render(request, 'editword.html', {'word': word})

