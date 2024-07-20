"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from api.models import db, Usuarios, Movimientos, Alertas_programadas, Objetivo, Eventos
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
#from admin import setup_admin


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

current_user = Usuarios.__name__

# Jorge -> A partir de aquí login y autenticación con JWT + token

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    usuarios_query = Usuarios.query.filter_by(email=email).first()
    if usuarios_query is None:
        return jsonify({"msg": "El usuario no existe"}), 401
    if password != usuarios_query.password:
        return jsonify({"msg": "La contraseña es incorrecta."}), 401
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200
    
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user()), 200

# Jorge -> Fin del login y autenticación con JWT + token

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    print ("HOLA")
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Jorge -> A partir de aquí los métodos GET ALL con rutas protegidas para todos los endpoints
@api.route('/usuarios', methods=['GET'])
@jwt_required()
def handle_usuarios():
    usuarios = Usuarios.query.all()
    usuarios_serialized = list(map(lambda item:item.serialize(), usuarios))
    response_body = {
        "msg": "OK",
        "data": usuarios_serialized
    }
    return jsonify(response_body), 200

@api.route('/movimientos', methods=['GET'])
@jwt_required()
def handle_movimientos():
    movimientos = Movimientos.query.all()
    movimientos_serialized = list(map(lambda item:item.serialize(), movimientos))
    response_body = {
        "msg": "OK",
        "data": movimientos_serialized
    }
    return jsonify(response_body), 200

@api.route('/alertas_programadas', methods=['GET'])
@jwt_required()
def handle_alertas_programadas():
    alertas_programadas = Alertas_programadas.query.all()
    alertas_programadas_serialized = list(map(lambda item:item.serialize(), alertas_programadas))
    response_body = {
        "msg": "OK",
        "data": alertas_programadas_serialized
    }
    return jsonify(response_body), 200

@api.route('/objetivo', methods=['GET'])
@jwt_required()
def handle_objetivo():
    objetivo = Objetivo.query.all()
    objetivo_serialized = list(map(lambda item:item.serialize(), objetivo))
    response_body = {
        "msg": "OK",
        "data": objetivo_serialized
    }
    return jsonify(response_body), 200

@api.route('/eventos', methods=['GET'])
@jwt_required()
def handle_eventos():
    eventos = Eventos.query.all()
    eventos_serialized = list(map(lambda item:item.serialize(), eventos))
    response_body = {
        "msg": "OK",
        "data": eventos_serialized
    }
    return jsonify(response_body), 200
# Jorge -> fin de los GET ALL