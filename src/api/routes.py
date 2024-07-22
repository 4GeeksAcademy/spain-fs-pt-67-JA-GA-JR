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

# Jorge -> A partir de aquí los POST
@api.route('/usuarios', methods=['POST'])
@jwt_required()
def create_usuarios():
    body = request.json
    me = Usuarios(nombre=body["nombre"], telefono=body["telefono"], email=body["email"], password=body["password"], activado=body["activado"])
    db.session.add(me)
    db.session.commit()
    response_body = {
        "msg": "Ok",
        "id": me.id
    }
    return jsonify(response_body), 200

# Jorge -> Este POST de /movimientos es diferente porque tiene varios casos de uso:
# Se puede crear un movimiento sin evento
# Se puede crear un movimiento sin objetivo
# Se puede crear un movimiento con evento + objetivo
# Se ajusta la lógica del POST para poder crear todos desde la misma llamada y las respuestas dependiendo de lo que pueda faltar.
@api.route('/movimientos', methods=['POST'])
@jwt_required()
def create_movimientos():
    body = request.json
    eventos_relacion = body.get("eventos_relacion")
    objetivo_relacion = body.get("objetivo_relacion")
    usuarios_relacion = int(body["usuarios_relacion"])

    if eventos_relacion and not Eventos.query.get(eventos_relacion):
        return jsonify({"msg": f"Eventos ID {eventos_relacion} does not exist"}), 400
    if objetivo_relacion and not Objetivo.query.get(objetivo_relacion):
        return jsonify({"msg": f"Objetivo ID {objetivo_relacion} does not exist"}), 400
    if not Usuarios.query.get(usuarios_relacion):
        return jsonify({"msg": f"Usuarios ID {usuarios_relacion} does not exist"}), 400

    try:
        me = Movimientos(
            nombre=body["nombre"],
            monto=int(body["monto"]),
            tipo_movimiento=body["tipo_movimiento"],
            motivo=body["motivo"],
            eventos_relacion=eventos_relacion,
            objetivo_relacion=objetivo_relacion,
            fecha=body["fecha"],
            usuarios_relacion=usuarios_relacion
        )
        db.session.add(me)
        db.session.commit()
        response_body = {
            "msg": "Ok",
            "id": me.id
        }
        return jsonify(response_body), 200
    except KeyError as e:
        return jsonify({"msg": f"Missing key: {e}"}), 400
    except ValueError as e:
        return jsonify({"msg": f"Invalid value: {e}"}), 400
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {e}"}), 500
# fin del POST de /movimientos

@api.route('/alertas_programadas', methods=['POST'])
@jwt_required()
def create_alertas_programadas():
    body = request.json
    me = Alertas_programadas(
            nombre=body["nombre"],
            monto=int(body["monto"]),
            tipo_movimiento=body["tipo_movimiento"],
            antelacion=body["antelacion"],
            motivo=body["motivo"],
            fecha_esperada=body["fecha_esperada"],
            usuarios_relacion=body["usuarios_relacion"]
            )
    db.session.add(me)
    db.session.commit()
    response_body = {
        "msg": "Ok",
        "id": me.id
    }
    return jsonify(response_body), 200

@api.route('/objetivo', methods=['POST'])
@jwt_required()
def create_objetivo():
    body = request.json
    me = Objetivo(nombre=body["nombre"], monto=int(body["monto"]), fecha_objetivo=body["fecha_objetivo"], cuota_mensual=int(body["cuota_mensual"]), usuarios_relacion=body["usuarios_relacion"])

    db.session.add(me)
    db.session.commit()
    response_body = {
        "msg": "Ok",
        "id": me.id
    }
    return jsonify(response_body), 200

@api.route('/eventos', methods=['POST'])
@jwt_required()
def create_eventos():
    body = request.json
    me = Eventos(nombre=body["nombre"])

    db.session.add(me)
    db.session.commit()
    response_body = {
        "msg": "Ok",
        "id": me.id
    }
    return jsonify(response_body), 200
# Jorge -> fin de los POST

# Jorge -> A partir de aquí los PUT
@api.route('/usuarios/<int:usuario_id>', methods=['PUT'])
@jwt_required()
def update_usuarios(usuario_id):
    usuario = Usuarios.query.get(usuario_id)
    if usuario:
        body = request.json
        usuario.nombre = body.get("nombre", usuario.nombre)
        usuario.telefono = body.get("telefono", usuario.telefono)
        usuario.email = body.get("email", usuario.email)
        usuario.password = body.get("password", usuario.password)
        usuario.activado = body.get("activado", usuario.activado)
        db.session.commit()
        return jsonify({"msg": "Usuario actualizado", "data": usuario.serialize()}), 200
    else:
        return jsonify({"msg": "El usuario no existe"}), 404

@api.route('/movimientos/<int:movimiento_id>', methods=['PUT'])
@jwt_required()
def update_movimientos(movimiento_id):
    movimiento = Movimientos.query.get(movimiento_id)
    if movimiento:
        body = request.json
        movimiento.nombre = body.get("nombre", movimiento.nombre)
        movimiento.monto = body.get("monto", movimiento.monto)
        movimiento.tipo_movimiento = body.get("tipo_movimiento", movimiento.tipo_movimiento)
        movimiento.motivo = body.get("motivo", movimiento.motivo)
        movimiento.eventos_relacion= body.get("eventos_relacion", movimiento.eventos_relacion)
        movimiento.objetivo_relacion= body.get("objetivo_relacion", movimiento.objetivo_relacion)
        movimiento.fecha = body.get("fecha", movimiento.fecha)
        movimiento.usuarios_relacion= body.get("usuarios_relacion", movimiento.usuarios_relacion)
        db.session.commit()
        return jsonify({"msg": "Movimiento actualizado", "data": movimiento.serialize()}), 200
    else:
        return jsonify({"msg": "Esta transacción no existe"}), 404

@api.route('/alertas_programadas/<int:alerta_id>', methods=['PUT'])
@jwt_required()
def update_alertas_programadas(alerta_id):
    alerta = Alertas_programadas.query.get(alerta_id)
    if alerta:
        body = request.json
        alerta.nombre = body.get("nombre", alerta.nombre)
        alerta.monto = body.get("monto", alerta.monto)
        alerta.tipo_movimiento = body.get("tipo_movimiento", alerta.tipo_movimiento)
        alerta.antelacion = body.get("antelacion", alerta.antelacion)
        alerta.motivo = body.get("motivo", alerta.motivo)
        alerta.fecha_esperada = body.get("fecha_esperada", alerta.fecha_esperada)
        alerta.usuarios_relacion= body.get("usuarios_relacion", alerta.usuarios_relacion)
        db.session.commit()
        return jsonify({"msg": "Alerta actualizada", "data": alerta.serialize()}), 200
    else:
        return jsonify({"msg": "Esta alerta no existe"}), 404

@api.route('/objetivo/<int:objetivo_id>', methods=['PUT'])
@jwt_required()
def update_objetivo(objetivo_id):
    objetivo = Objetivo.query.get(objetivo_id)
    if objetivo:
        body = request.json
        objetivo.nombre = body.get("nombre", objetivo.nombre)
        objetivo.monto = body.get("monto", objetivo.monto)
        objetivo.fecha_objetivo = body.get("fecha_objetivo", objetivo.fecha_objetivo)
        objetivo.cuota_mensual = body.get("cuota_mensual", objetivo.cuota_mensual)
        objetivo.usuarios_relacion= body.get("usuarios_relacion", objetivo.usuarios_relacion)
        db.session.commit()
        return jsonify({"msg": "Objetivo actualizado", "data": objetivo.serialize()}), 200
    else:
        return jsonify({"msg": "Esta objetivo no existe"}), 404
    
@api.route('/eventos/<int:evento_id>', methods=['PUT'])
@jwt_required()
def update_eventos(evento_id):
    evento = Eventos.query.get(evento_id)
    if evento:
        body = request.json
        evento.nombre = body.get("nombre", evento.nombre)
        db.session.commit()
        return jsonify({"msg": "Evento actualizado", "data": evento.serialize()}), 200
    else:
        return jsonify({"msg": "Este evento no existe"}), 404
# Jorge -> fin de los PUT