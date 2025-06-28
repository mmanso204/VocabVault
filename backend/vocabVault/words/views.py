from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .models import Words, FrenchWord, GermanWord
from users.models import FavoriteWord
from datetime import date
from django.contrib.sessions.models import Session
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core import serializers
import datetime
from django.contrib.auth.models import User
from django.utils import timezone


def homepage(request):
    """
    Render the homepage with the word of the day.

    This function retrieves the language in the url of the user session. Then it calculates today date in the dd/mm/yyyy format to retrieve the word on that date.
    With the langauge of the session it chooses the correct model to take the word from.
    It then renders the homepage.html with additional context, like the day in formatted form, the language of the page, and the word information.

    Parameters:
    request (HttpRequest)

    Returns:
    HttpResponse: The rendered homepage with context data.
    """
    # Retrieve the selected language from the session (default to English if not set)
    selected_language = request.session.get('selected_language', 'English')
    print(f"Selected Language: {selected_language}")

    # Get today's date and format it
    today = date.today()
    today_formatted = today.strftime('%d/%m/%Y')

    # Select the appropriate model based on the selected language
    if selected_language == 'French':
        WordModel = FrenchWord
    elif selected_language == 'German':
        WordModel = GermanWord
    else:
        WordModel = Words  # Default to English words model

    try:
        # Retrieve word of the day based on selected language and today's date
        word_of_the_day = WordModel.objects.get(date=today_formatted)
    except WordModel.DoesNotExist:
        word_of_the_day = None  # Handle case where no word matches today

    # Prepare context to pass to the template
    context = {
        'word_of_the_day': word_of_the_day,
        'today_formatted': today_formatted,
        'selected_language': selected_language,
    }

    return render(request, 'HomePage.html', context)

def select_language(request, language):
    """
    This function sets the selected language in the user session and redirects the user to the homepage

    Parameters:
    request (HttpRequest)
    language specified in the url

    Returns:
    HttpResponse: The rendered homepage with context data.
    """
    request.session['selected_language'] = language
    return redirect('/homepage/')

def searchresults(request):
   
  template = loader.get_template('SearchResultsPage.html')

  return HttpResponse(template.render())

def account(request):
   
  #template = loader.get_template('accountpage.html')

  return render(request, 'accountpage.html')

def addword(request):
    """
    This function processes the form submission to add a new word to the user's favorites. If the request method is POST
    and the user is authenticated, it retrieves the form data, creates a new FavoriteWord instance, and saves it to the
    database. It then redirects the user to the favorites page. If the request method is GET, it renders the 'AddNewWord.html'
    template.

    Parameters:
    request (HttpRequest)

    Returns:
    HttpResponse
    addword.html
    """
    if request.method == 'POST':
      # Retrieve the form data from the POST request
      word_name = request.POST.get('word_name')  # Assuming 'word_name' is the name attribute of the word input field
      # Get other form data like part of speech, pronunciation, meaning here
      print(1)
      # Assuming the request.user is the current logged-in user
      # You might need to check if the user is authenticated before proceeding to save the word
      if request.user.is_authenticated:
          print(2)
          user = request.user
          # Create a new instance of the FavoriteWord model
          word_name = request.POST.get('word_name', '')
          phonetic = request.POST.get('phonetic', '')
          meaning = request.POST.get('meaning', '')
          date = request.POST.get('date', '')
          function = request.POST.get('function', '')
          # Set other attributes of the new_word instance
          # For example:
          # new_word.part_of_speech = request.POST.get('part_of_speech')
          # new_word.pronunciation = request.POST.get('pronunciation')
          # new_word.meaning = request.POST.get('meaning')
          new_word = FavoriteWord(user=user, word=word_name, phonetic=phonetic, meaning=meaning, date=date, function=function)

          # Save the new word to the database
          new_word.save()
          print(f"New word submitted: {word_name}")

          # Redirect to a success page or the same page after adding the word
          return redirect('/favorites')  # Change 'success_page' to the URL name of your success page

      # Return the same template for GET requests or when form submission fails
    return render(request, 'AddNewWord.html')

def show_favorite_words(request):
    """
    This function retrieves the favorite words for the currently logged-in user and renders the 'FavoritesPage.html' template
    with the favorite words passed in the context. If the user is not authenticated, it redirects to the login page.

    Parameters:
    request (HttpRequest)

    Returns:
    HttpResponse
    user_favorite_words dictionary
    """
    if request.user.is_authenticated:
        # Filter favorites for the currently logged-in user
        user_favorites = FavoriteWord.objects.filter(user=request.user)

        # Print a message to log the number of favorite words for the user
        print(f"Number of favorite words for user {request.user}: {user_favorites.count()}")

        # Pass the user-specific favorites to the template for display
        context = {
            'favorite_words': user_favorites
        }
        print(context)
        return render(request, 'FavoritesPage.html', context)
    else:
        # Print a message to log that the user is not authenticated
        print("User is not authenticated. Redirecting to login page.")

        # Handle the case when the user is not authenticated (e.g., redirect to login)
        return render(request, 'userloginpage.html')

def flashcards(request):
    """
    This function retrieves the favorite words for the currently logged-in user and renders the 'flashcards.html' template
    with the favorite words passed in the context. If the user is not authenticated, it redirects to the login page.

    Parameters:
    request (HttpRequest)

    Returns:
    HttpResponse
    user favorite words dictionary
    """
    if request.user.is_authenticated:
        user_favorites = FavoriteWord.objects.filter(user=request.user)
        context = {
            'favorite_words': user_favorites
        }
        print(context)
        return render(request, 'flashcards.html', context)
    else:
        # Print a message to log that the user is not authenticated
        print("User is not authenticated. Redirecting to login page.")

        # Handle the case when the user is not authenticated (e.g., redirect to login)
        return render(request, 'userloginpage.html')


def quizzes(request):
  # template = loader.get_template('QuizzesPage.html')
  return render(request, 'QuizzesPage.html', {'request': request})


def wordle(request):
    if request.user.is_authenticated:
        favorite_words = FavoriteWord.objects.filter(user=request.user)

        return render(request, 'WordlePage.html', {'favorite_words': list(favorite_words)})
    else:
        # Print a message to log that the user is not authenticated
        print("User is not authenticated. Redirecting to login page.")

        # Handle the case when the user is not authenticated (e.g., redirect to login)
        return render(request, 'userloginpage.html')

def members(request):
     return HttpResponse("Hello world!")

def delete_favorite(request, favorite_id):
    """
    This function handles the deletion of a favorite word entry identified by its ID. If the request method is POST,
    it retrieves the favorite word, deletes it, and redirects the user to the favorites page. If the favorite word
    does not exist, it handles the exception gracefully.

    Parameters:
    request (HttpRequest)
    favorite_id (int): The ID of the favorite word to be deleted.

    Returns:
    HttpResponse: A redirect to the favorites page.
    """
    if request.method == 'POST':
        try:
            favorite = FavoriteWord.objects.get(id=favorite_id)
            favorite.delete()  # Delete the favorite word
        except FavoriteWord.DoesNotExist:
            # Handle case where the favorite word does not exist
            pass
    return redirect('/favorites')  


def index(request):
    queryset = Words.objects.all()
    query = request.GET.get('search')
    filter_by = request.GET.get('filter')

    if query:
        queryset = queryset.filter(
            Q(phonetic__icontains=query) |
            Q(meaning__icontains=query) |
            Q(function__icontains=query) |
            Q(word__icontains=query) |
            Q(date__icontains=query)
        )
    
    if filter_by:
        queryset = queryset.filter(function=filter_by)

    context = {
        "object_list": queryset,
        "query": query,
        "filter_by": filter_by,
    }
    return render(request, "newSearchResults.html", context)

def wordDetail(request, word_id):

  word = get_object_or_404(Words, pk=word_id)

  today_formatted = word.date

  return render(request, 'HomePage.html', {'word_of_the_day': word, 'today_formatted': today_formatted,})

def add_to_favorite(request):
    word_to_add = request.POST.get('word')
    word_meaning = request.POST.get('meaning')
    # Get selected language from session or default to English
    selected_language = request.session.get('selected_language', 'English')

    user = request.user

    # Determine which model to use based on selected language
    if selected_language == 'French':
        WordModel = FrenchWord
    elif selected_language == 'German':
        WordModel = GermanWord
    else:
        WordModel = Words  # Default to English words model

    try:
        existing_favorite = FavoriteWord.objects.filter(user=user, word=word_to_add).first()

        if existing_favorite:
            return redirect('/favorites')
        else:
            # Create a new FavoriteWord object and save it
            new_favorite_word = FavoriteWord(user=user, meaning=word_meaning, word=word_to_add)
            new_favorite_word.save()

            # If user is authenticated, associate the favorite word with the user
            # Redirect to the favorites page after adding the word to favorites
            return redirect('/favorites')  # Assuming 'favorites' is the name of your favorites page URL

    except WordModel.DoesNotExist:
        # Handle case where no word matches today
        # Redirect or render an appropriate response
        return redirect('/homepage')  # Redirect to homepage or handle error as needed

    except Exception as e:
        print("hello")
        # Handle any other exceptions gracefully (e.g., logging)
        print(f"Error occurred: {str(e)}")
        return redirect('/homepage')  # Redirect to homepage or handle error as needed

def get_words(request):
    words = Words.objects.all()
    words_list = []
    for word in words:
      
       date = datetime.datetime.strptime(word.date, '%d/%m/%Y').strftime('%Y-%m-%d')
       words_list.append({
          'title': word.word,
          'start': date,
          'url': f'/word/{word.id}/'
       })
    
    return JsonResponse(words_list, safe=False)

def edit_favorite(request, favorite_id):
    if request.method == 'POST':
        # Retrieve the FavoriteWord object based on the favorite_id
        try:
            favorite_word = FavoriteWord.objects.get(id=favorite_id)
        except FavoriteWord.DoesNotExist:
            return HttpResponse("Favorite entry not found.", status=404)

        # Process the form data to update the favorite entry
        form_data = request.POST
        favorite_word.word = form_data.get('word', favorite_word.word)  # Update the field with the new value

        # Save the updated favorite entry
        favorite_word.save()

        # Redirect to a success page or a different URL after editing
        return redirect('/homepage')  # Redirect to a success page

    return HttpResponse("Method not allowed", status=405)  # Return if the method is not allowed

def edit_word(request, word_id):  # Ensure the parameter name matches the URL pattern
    word = get_object_or_404(FavoriteWord, id=word_id)
    
    if request.method == 'POST':
        # Handle form submission to update the word and meaning fields
        word.word = request.POST.get('word')
        word.meaning = request.POST.get('meaning')
        word.save()
        
        # Redirect to a success page or back to the favorites page
        return redirect('favorites')  # Replace with your favorites URL name
    
    return render(request, 'editwordPage.html', {'word': word})
