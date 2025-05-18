from flask import Flask
from flask_cors import CORS
from db import init_db
from routes import system_routes
import os

app = Flask(__name__)
CORS(app)

init_db(app)

app.register_blueprint(system_routes)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
