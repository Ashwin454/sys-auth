from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import MySQLdb.cursors
import requests
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# MySQL Config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Ashwin4545#'
app.config['MYSQL_DB'] = 'auth_system'
app.config['JWT_SECRET_KEY'] = 'gd;jgiodjiogj;dioaj;ih;iguuhaeiuhiuaehfiuehfih'  

mysql = MySQL(app)
jwt = JWTManager(app)

# --------- ROUTES ----------

import os
import requests
from urllib.parse import urlencode
from flask import request, jsonify, redirect

@app.route("/auth/linkedin/callback")
def linkedin_callback():
    code = request.args.get("code")
    state = request.args.get("state")

    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    # Step 1: Exchange code for access token (OpenID Connect flow)
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:5000/auth/linkedin/callback",  # Important: use 'localhost', not '127.0.0.1'
        "client_id": os.environ.get("LINKEDIN_CLIENT_ID", "77wwpkm9bcdsbe"),
        "client_secret": os.environ.get("LINKEDIN_CLIENT_SECRET", "WPL_AP1.NlQCzqs7EXbWsLQ3.z2oZvQ==")
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    token_res = requests.post(token_url, data=data, headers=headers)

    if token_res.status_code != 200:
        return jsonify({"error": "Failed to get access token", "details": token_res.text}), 400

    access_token = token_res.json().get("access_token")
    if not access_token:
        return jsonify({"error": "Access token missing"}), 400

    # Step 2: Get OpenID user info
    userinfo_url = "https://api.linkedin.com/v2/userinfo"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    userinfo_res = requests.get(userinfo_url, headers=headers)

    if userinfo_res.status_code != 200:
        return jsonify({"error": "Failed to fetch user info", "details": userinfo_res.text}), 400

    userinfo = userinfo_res.json()
    email = userinfo.get("email")
    full_name = userinfo.get("name") or f"{userinfo.get('given_name', '')} {userinfo.get('family_name', '')}".strip()

    if not email:
        return jsonify({"error": "Email not returned by LinkedIn"}), 400

    # Step 3: Create or fetch user from database
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        cursor.execute(
            "INSERT INTO users (username, email, college, dob, password) VALUES (%s, %s, %s, %s, %s)",
            (full_name, email, "LinkedIn OpenID", "", "")
        )
        mysql.connection.commit()

    # Step 4: Issue JWT token
    jwt_token = create_access_token(identity=email)

    # Step 5: Redirect to frontend with token
    query = urlencode({"token": jwt_token})
    return redirect(f"http://localhost:3000/")

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    college = data.get("college")
    email = data.get("email")
    dob = data.get("dob")
    password = data.get("password")
    confirm = data.get("confirmPassword")

    if not (username and email and password and confirm and dob):
        return jsonify({"error": "Missing fields"}), 400

    if password != confirm:
        return jsonify({"error": "Passwords do not match"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    if cursor.fetchone():
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    cursor.execute(
        "INSERT INTO users (username, college, email, dob, password) VALUES (%s, %s, %s, %s, %s)",
        (username, college, email, dob, hashed_pw)
    )
    mysql.connection.commit()

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"message": "Login successful", "token": access_token}), 200


@app.route("/api/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("SELECT username, email, college FROM users WHERE email=%s", (current_user,))
    user = cursor.fetchone()
    return jsonify(user), 200


# OAuth endpoints (Google/GitHub) — mocked for now
@app.route("/api/oauth/google", methods=["POST"])
def oauth_google():
    # Add token verification logic here if needed
    return jsonify({"message": "Google OAuth successful (mocked)"}), 200

@app.route("/api/oauth/github", methods=["POST"])
def oauth_github():
    return jsonify({"message": "GitHub OAuth successful (mocked)"}), 200


if __name__ == "__main__":
    app.run(debug=True)
