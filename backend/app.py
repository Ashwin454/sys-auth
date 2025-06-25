from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from urllib.parse import urlencode
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
Bcrypt = Bcrypt(app)

# --- Config ---
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# --- Init Extensions ---
db = SQLAlchemy(app)
jwt = JWTManager(app)

# --- Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    college = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    dob = db.Column(db.String(20))
    password = db.Column(db.String(255))  # hashed

with app.app_context():
    db.create_all()

# --- Routes ---
@app.route("/auth/linkedin/callback")
def linkedin_callback():
    code = request.args.get("code")
    state = request.args.get("state")

    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://127.0.0.1:5000/auth/linkedin/callback",
        "client_id": os.getenv("LINKEDIN_CLIENT_ID"),
        "client_secret": os.getenv("LINKEDIN_CLIENT_SECRET")
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    token_res = requests.post(token_url, data=data, headers=headers)

    if token_res.status_code != 200:
        return jsonify({"error": "Failed to get access token", "details": token_res.text}), 400

    access_token = token_res.json().get("access_token")
    if not access_token:
        return jsonify({"error": "Access token missing"}), 400

    userinfo_url = "https://api.linkedin.com/v2/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    userinfo_res = requests.get(userinfo_url, headers=headers)

    if userinfo_res.status_code != 200:
        return jsonify({"error": "Failed to fetch user info", "details": userinfo_res.text}), 400

    userinfo = userinfo_res.json()
    email = userinfo.get("email")
    full_name = userinfo.get("name") or f"{userinfo.get('given_name', '')} {userinfo.get('family_name', '')}".strip()

    if not email:
        return jsonify({"error": "Email not returned by LinkedIn"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(username=full_name, email=email, college="LinkedIn OpenID", dob="", password="")
        db.session.add(user)
        db.session.commit()

    jwt_token = create_access_token(identity=email)
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
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = Bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(username=username, college=college, email=email, dob=dob, password=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not Bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"message": "Login successful", "token": access_token}), 200

@app.route("/api/profile", methods=["GET"])
@jwt_required()
def profile():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    return jsonify({
        "username": user.username,
        "email": user.email,
        "college": user.college,
        "dob": user.dob
    })

@app.route("/api/oauth/google", methods=["POST"])
def oauth_google():
    return jsonify({"message": "Google OAuth successful (mocked)"}), 200

@app.route("/api/oauth/github", methods=["POST"])
def oauth_github():
    return jsonify({"message": "GitHub OAuth successful (mocked)"}), 200

if __name__ == "__main__":
    app.run(debug=True)
