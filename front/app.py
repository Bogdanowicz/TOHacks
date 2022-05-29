import os
from flask import Flask, send_from_directory, render_template, request, redirect, url_for, abort, make_response

# app configuration
app = Flask(__name__, template_folder='templates', static_folder='css')

@app.route('/')
@app.route('/home')
def home_page():
    return render_template('base.html')

@app.route('/login', methods = ['POST', 'GET'])
def login():
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return "must provide username"

        # Ensure password was submitted
        elif not request.form.get("password"):
            return "must provide password"

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")
                
@app.route('/signup', methods = ['POST', 'GET'])
def signup():
    pass


if __name__ == "__main__":
    app.run(debug=True)
