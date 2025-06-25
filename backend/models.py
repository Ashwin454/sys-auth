from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    college = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    dob = db.Column(db.String(20))
    password = db.Column(db.String(255))  # hashed
