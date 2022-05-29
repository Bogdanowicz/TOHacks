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
    if(request.method == 'POST'):
        username = request.form.get('username')
        password = request.form.get('password')



if __name__ == "__main__":
    app.run(debug=True)
