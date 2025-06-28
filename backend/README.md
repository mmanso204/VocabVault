# VocabVault

<table>
  <tr>
    <td>
      <img src="/website_images/homepage_img.png" alt="Homepage" width="400"/>
    </td>
    <td>
      <img src="/website_images/favorites_img.png" alt="Favorites page" width="400"/>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <img src="/website_images/quizzes_img.png" alt="Quizzes page" width="400"/>
    </td>
    <td>
      <img src="/website_images/wordle_img.png" alt="Wordle game" width="400"/>
    </td>
  </tr>
</table>

## Brief description of the project
VocabVault focuses on broadening the users vocabulary through fun and educational features. The web application has a homepage containing the word of the day with the meaning, function and phonetics of the specific word. After the user registered and logged in with their account, this word can be added to favorites, which stores the user's favorite words. The user can create custom favorite words as well as read, delete, and update their existing favorite words. Words of the previous days are accessible through a simple calendar pop up. Finally, the favorite words can be studied through the quizzes page with wordle and flashcards available.

### Technology Stack
This project utilizes the following technologies:

- Frontend: HTML, CSS, and JavaScript
- Backend: Django, a Python-based web framework

## Team members
- **Indigo cheuk-a-lam** (ich104)
- **Harun Yılmaz** (cnf877)
- **Michael Manso** (mma766)

## Installation details
This project can be runned locally by cloning this repository

Git needs to be dowloaded to clone repository!!
Guide to download git:
https://github.com/git-guides/install-git

Steps of cloning this repository through terminal
1. Navigate to the Repository

2. Go to the main page of the repository on GitHub.com. 

3. Click the "Code" button above the list of files.

4. Choose your preferred cloning method (HTTPS, SSH, or GitHub CLI) and copy the URL.

5. Open your terminal application.

6. Navigate to the directory where you want to clone the repository.

7. Type git clone, paste the URL you copied, and press Enter.
  ```
  git clone https://github.com/VU-Applied-Programming-for-AI-2024/Group-39.git
  ```

This repository is also available to clone through github desktop

## Architecture

<img src="/website_images/architecture.png" alt="Homepage" width="400"/>

## How to open the webpage

1. Clone the repository using the command provided in the README.md file.
2. Navigate to the project directory: `cd Group-39`
3. Create a Python virtual environment:
  ```
  python -m venv myenv
  ```
4. Activate the virtual environment:
- On Windows: `myenv\Scripts\activate`
- On macOS and Linux: `source myenv/bin/activate`
5. Install the required software in the requirment.txt file:
  ```
  pip install -r requirements.txt
  ```
6. Go into the "vocabVault" directory: `cd backend/vocabVault`
7. Run the Django server:
  ```
  python manage.py runserver
  ```
8. Go to http://127.0.0.1:8000/homepage address in your browser

## Installing the requirements
1. Create a Python virtual environment
2. Go to the root directory of the project where the requirements.txt file is located.
3. Use the terminal command `pip install -r requirements.txt` to install the requirements 
