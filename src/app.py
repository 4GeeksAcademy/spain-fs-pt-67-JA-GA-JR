"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_mail import Mail  # Importamos Flask-Mail
from api.utils import APIException, generate_sitemap
from api.models import db
from api.admin import setup_admin
from api.commands import setup_commands
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS

# Jorge -> Configuración inicial de la app Flask + JWT Extended
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Tratando de solucionar error de CORS, así permite cualquier origen
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
JWTManager(app)
app.url_map.strict_slashes = False

# Jorge -> Configuración de Mailtrap
app.config['MAIL_SERVER'] = 'sandbox.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = os.getenv('FLASK_MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('FLASK_MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Agregar admin
setup_admin(app)

# Agregar comandos personalizados
setup_commands(app)

# Agregar todos los endpoints de la API con el prefijo "api"
from api.routes import api  # Jorge -> Importamos api después de inicializar mail, para evitar error de importación circular
app.register_blueprint(api, url_prefix='/api')

# Manejar errores/serializar errores como un objeto JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Servir cualquier otro archivo como estático
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # evitar la caché
    return response

# Esto solo se ejecuta si se ejecuta `$ python src/main.py`
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
