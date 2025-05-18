from flask_pymongo import PyMongo
from flask import current_app
from dotenv import load_dotenv
import os

mongo = PyMongo()
load_dotenv()

def init_db(app):
    app.config["MONGO_URI"] = os.getenv("MONGOURI")
    mongo.init_app(app)

    try:
        # Ping the MongoDB server to ensure it's connected
        mongo.cx.admin.command('ping')
        print("MongoDB connection successful!")
    except Exception as e:
        print("MongoDB connection failed:", e)

def get_db():
    return mongo.db