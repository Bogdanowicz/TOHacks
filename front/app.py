import os
import requests
import globals
from flask import Flask, send_from_directory, render_template, request, redirect, url_for, abort, make_response

# app configuration
app = Flask(__name__, template_folder='templates', static_folder='css')

ID_TOKEN_COOKIE_NAME = 'idToken'

@app.route('/')
@app.route('/home')
def home_page():
    return render_template('login.html')

@app.route('/login', methods = ['POST', 'GET'])
def login():
    print('login start!!')
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        username = request.form.get("email")
        password = request.form.get("password")

        print(username)
        print(password)

        # Ensure username was submitted
        if not username:
            return "must provide username"

        # Ensure password was submitted
        elif not password:
            return "must provide password"

        endpoint = 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={}'.format(globals.FIREBASE_KEY)
        headers = {
            "email": username,
            "password": password,
            "returnSecureToken":True
        }
        idTokenArg = 'idToken'
        response = requests.post(endpoint, json=headers).json()
        if idTokenArg not in response:
            return 400
        idtoken = response['idToken']
        print(idtoken)
        resp = make_response(render_template("base.html"))
        resp.set_cookie(ID_TOKEN_COOKIE_NAME, idtoken)
        return resp, 200

    # print(response)
    # return None if 'error' in response else response['upload_url']

        # Redirect user to home page
        return redirect("/")
    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route('/profile', methods = ['POST', 'GET'])
def profile():
    print('profile start!!')
    idtoken = request.cookies.get('userID')
    print(idtoken)
    return redirect("/")
                
@app.route('/signup', methods = ['POST', 'GET'])
def signup():
    print('signup start!!')
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        username = request.form.get("email")
        password = request.form.get("password")

        print(username)
        print(password)

        # Ensure username was submitted
        if not username:
            return "must provide username"

        # Ensure password was submitted
        elif not password:
            return "must provide password"
        endpoint = 'http://localhost:5001/tohacksproj2022/us-central1/api/signup'
        userInfo = {
            "email": username,
            "password": password,
            "confirmPassword": password,
            "handle": "",
        }
        response = requests.post(endpoint, json=userInfo).json()
        print(response)

    # print(response)
    # return None if 'error' in response else response['upload_url']

        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")
        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("signup.html")

if __name__ == "__main__":
    app.run(debug=True)
