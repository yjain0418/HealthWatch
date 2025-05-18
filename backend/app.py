from flask import Flask
from flask_cors import CORS
from db import init_db
from routes import system_routes

app = Flask(__name__)
CORS(app)

init_db(app)

app.register_blueprint(system_routes)

if __name__ == '__main__':
    app.run(debug=True)