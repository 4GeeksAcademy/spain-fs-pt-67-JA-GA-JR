"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import bcrypt
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from .models import db, Usuarios, Movimientos, Alertas_programadas, Objetivo, Eventos
from .utils import generate_sitemap, APIException, generate_random_password
from flask_cors import CORS
from flask_migrate import Migrate
import cloudinary
import cloudinary.uploader
import cloudinary.api
from config import cloudinary
from flask_mail import Message  # Jorge -> Importamos Message de Flask-Mail

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
    
    # Jorge -> y aquí verificamos si la contraseña introducida coincide con el hash almacenado en la BBDD
    if not bcrypt.checkpw(password.encode('utf-8'), usuarios_query.password.encode('utf-8')):
        return jsonify({"msg": "La contraseña es incorrecta."}), 401
    
    access_token = create_access_token(identity=usuarios_query.id)
    return jsonify(access_token=access_token), 200
    
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user()), 200

# Jorge -> Fin del login y autenticación con JWT + token
# Jorge -> Inicio de RESET PASSWORD
@api.route("/reset-password", methods=["PUT"])
def reset_password():
    from app import mail  # Jorge -> Importamos mail dentro de la función para evitar circular imports

    data = request.json
    user = Usuarios.query.filter_by(email=data.get("email")).first()
    
    if not user:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404
    
    # Jorge -> Generamos una nueva contraseña aleatoria
    new_password = generate_random_password()
    
    # Jorge -> Hasheamos la nueva contraseña antes de guardarla en la base de datos
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user.password = hashed_password
    db.session.commit()

    # Jorge -> Enviamos la nueva contraseña por correo electrónico usando Mailtrap
    msg = Message(subject='Restablecimiento de contraseña', 
                  sender='jmailtrap@demomailtrap.com', 
                  recipients=[user.email])
    msg.body = f'Tu nueva contraseña es: {new_password}'
    mail.send(msg)
    
    return jsonify({"success": True, "message": "Contraseña restablecida exitosamente"}), 200
# Jorge -> FIN DE RESET PASSWORD

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
def create_usuarios():
    body = request.json
    # Jorge -> Hasheamos la contraseña antes de almacenarla
    hashed_password = bcrypt.hashpw(body["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    me = Usuarios(
        nombre=body["name"], 
        telefono=body["phone"], 
        email=body["email"], 
        password=hashed_password,  # Guardamos la contraseña hasheada
        activado=True
    )
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
    user_id = get_jwt_identity()
    body = request.json
    eventos_relacion = body.get("eventos_relacion")
    objetivo_relacion = body.get("objetivo_relacion")

    if eventos_relacion and not Eventos.query.get(eventos_relacion):
        return jsonify({"msg": f"Eventos ID {eventos_relacion} does not exist"}), 400
    if objetivo_relacion and not Objetivo.query.get(objetivo_relacion):
        return jsonify({"msg": f"Objetivo ID {objetivo_relacion} does not exist"}), 400
    print(user_id)
    try:
        me = Movimientos(
            nombre=body["nombre"],
            monto=int(body["monto"]),
            tipo_movimiento=body["tipo_movimiento"],
            motivo=body["motivo"],
            eventos_relacion=eventos_relacion,
            objetivo_relacion=objetivo_relacion,
            fecha=body["fecha"],
            usuarios_relacion=user_id
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
    user_id = get_jwt_identity()
    body = request.json
    me = Alertas_programadas(
            nombre=body["nombre"],
            monto=int(body["monto"]),
            tipo_movimiento=body["tipo_movimiento"],
            antelacion=body["antelacion"],
            motivo=body["motivo"],
            fecha_esperada=body["fecha_esperada"],
            usuarios_relacion=user_id
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
    user_id = get_jwt_identity()
    body = request.json

    # Jorge -> Si 'fecha_objetivo' o 'cuota_mensual' no están presentes en el body, se interpreta como None
    fecha_objetivo = body.get("fecha_objetivo")
    cuota_mensual = body.get("cuota_mensual")

    # Jorge -> ahora validamos que 'cuota_mensual' solo se convierta a int si NO es None
    if cuota_mensual is not None and cuota_mensual != 'None':
        cuota_mensual = int(cuota_mensual)
    else:
        cuota_mensual = None

    # Jorge -> Ahora creamos el objetivo con los valores que se introduzcan o None para los opcionales
    me = Objetivo(
        nombre=body["nombre"],
        monto=int(body["monto"]),
        fecha_objetivo=fecha_objetivo,
        cuota_mensual=cuota_mensual,
        usuarios_relacion=user_id
    )

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
    user_id = get_jwt_identity()
    body = request.json
    me = Eventos(
        nombre=body["nombre"],
        usuarios_relacion=user_id
    )

    db.session.add(me)
    db.session.commit()
    response_body = {
        "msg": "Ok",
        "id": me.id
    }
    return jsonify(response_body), 200
# Jorge -> fin de los POST

# Jorge -> A partir de aquí los PUT por ID
@api.route('/usuarios/<int:usuario_id>', methods=['PUT'])
@jwt_required()
def update_usuario(usuario_id):
    user_id = get_jwt_identity()
    if user_id != usuario_id:
        return jsonify({"msg": "No tienes permiso para actualizar este usuario"}), 403

    usuario = Usuarios.query.get(usuario_id)
    if not usuario:
        raise APIException("Usuario no encontrado", status_code=404)

    data = request.form
    if "foto_perfil" in request.files:
        upload_result = cloudinary.uploader.upload(request.files["foto_perfil"])
        foto_perfil_url = upload_result["secure_url"]
        usuario.foto_perfil_url = foto_perfil_url
    if "nombre" in data:
        usuario.nombre = data["nombre"]
    if "telefono" in data:
        usuario.telefono = data["telefono"]
    if "email" in data:
        usuario.email = data["email"]
    if "password" in data:
        # Jorge -> hasheamos la nueva contraseña antes de guardarla en la bbdd
        usuario.password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise APIException(f"Error actualizando el usuario: {str(e)}, status_code=500")

    return jsonify(usuario.serialize()), 200

@api.route('/movimientos/<int:movimiento_id>', methods=['PUT'])
@jwt_required()
def update_movimientos(movimiento_id):
    user_id = get_jwt_identity()
    movimiento = Movimientos.query.get(movimiento_id)
    if movimiento and movimiento.usuarios_relacion == user_id:
        body = request.json
        movimiento.nombre = body.get("nombre", movimiento.nombre)
        movimiento.monto = body.get("monto", movimiento.monto)
        movimiento.tipo_movimiento = body.get("tipo_movimiento", movimiento.tipo_movimiento)
        movimiento.motivo = body.get("motivo", movimiento.motivo)
        movimiento.eventos_relacion= body.get("eventos_relacion", movimiento.eventos_relacion)
        movimiento.objetivo_relacion= body.get("objetivo_relacion", movimiento.objetivo_relacion)
        movimiento.fecha = body.get("fecha", movimiento.fecha)
        db.session.commit()
        return jsonify({"msg": "Movimiento actualizado", "data": movimiento.serialize()}), 200
    else:
        return jsonify({"msg": "Esta transacción no existe o no tienes permiso para actualizarla"}), 404

@api.route('/alertas_programadas/<int:alerta_id>', methods=['PUT'])
@jwt_required()
def update_alertas_programadas(alerta_id):
    user_id = get_jwt_identity()
    alerta = Alertas_programadas.query.get(alerta_id)
    if alerta and alerta.usuarios_relacion == user_id:
        body = request.json
        alerta.nombre = body.get("nombre", alerta.nombre)
        alerta.monto = body.get("monto", alerta.monto)
        alerta.tipo_movimiento = body.get("tipo_movimiento", alerta.tipo_movimiento)
        alerta.antelacion = body.get("antelacion", alerta.antelacion)
        alerta.motivo = body.get("motivo", alerta.motivo)
        alerta.fecha_esperada = body.get("fecha_esperada", alerta.fecha_esperada)
        db.session.commit()
        return jsonify({"msg": "Alerta actualizada", "data": alerta.serialize()}), 200
    else:
        return jsonify({"msg": "Esta alerta no existe o no tienes permiso para actualizarla"}), 404

@api.route('/objetivo/<int:objetivo_id>', methods=['PUT'])
@jwt_required()
def update_objetivo(objetivo_id):
    user_id = get_jwt_identity()
    objetivo = Objetivo.query.get(objetivo_id)
    if objetivo and objetivo.usuarios_relacion == user_id:
        body = request.json
        objetivo.nombre = body.get("nombre", objetivo.nombre)
        objetivo.monto = body.get("monto", objetivo.monto)
        objetivo.fecha_objetivo = body.get("fecha_objetivo", objetivo.fecha_objetivo)
        objetivo.cuota_mensual = body.get("cuota_mensual", objetivo.cuota_mensual)
        db.session.commit()
        return jsonify({"msg": "Objetivo actualizado", "data": objetivo.serialize()}), 200
    else:
        return jsonify({"msg": "Este objetivo no existe o no tienes permiso para actualizarlo"}), 404
    
@api.route('/eventos/<int:evento_id>', methods=['PUT'])
@jwt_required()
def update_eventos(evento_id):
    user_id = get_jwt_identity()
    evento = Eventos.query.get(evento_id)
    if evento and evento.usuarios_relacion == user_id:
        body = request.json
        evento.nombre = body.get("nombre", evento.nombre)
        db.session.commit()
        return jsonify({"msg": "Evento actualizado", "data": evento.serialize()}), 200
    else:
        return jsonify({"msg": "Este evento no existe o no tienes permiso para actualizarlo"}), 404
# Jorge -> fin de los PUT

# Jorge -> a partir de aquí los DELETE por ID
@api.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(usuario_id):
    user_id = get_jwt_identity()
    if user_id != usuario_id:
        return jsonify({"msg": "No tienes permiso para eliminar este usuario"}), 403

    usuario = Usuarios.query.get(usuario_id)
    if usuario:
        Movimientos.query.filter_by(usuarios_relacion=usuario_id).delete()
        Alertas_programadas.query.filter_by(usuarios_relacion=usuario_id).delete()
        Objetivo.query.filter_by(usuarios_relacion=usuario_id).delete()
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"msg": "El usuario y los elementos relacionados han sido eliminados"}), 200
    else:
        return jsonify({"msg": "El usuario no existe"}), 404

@api.route('/movimientos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_movimiento(id):
    user_id = get_jwt_identity()
    movimiento = Movimientos.query.get(id)
    if movimiento and movimiento.usuarios_relacion == user_id:
        db.session.delete(movimiento)
        db.session.commit()
        return jsonify({"message": "Movimiento eliminado"}), 200
    else:
        return jsonify({"msg": "Movimiento no encontrado o no tienes permiso para eliminarlo"}), 404

@api.route('/alertas_programadas/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_alerta_programada(id):
    user_id = get_jwt_identity()
    alerta_programada = Alertas_programadas.query.get(id)
    if alerta_programada and alerta_programada.usuarios_relacion == user_id:
        db.session.delete(alerta_programada)
        db.session.commit()
        return jsonify({"message": "Alerta programada eliminada"}), 200
    else:
        return jsonify({"msg": "Alerta programada no encontrada o no tienes permiso para eliminarla"}), 404

@api.route('/objetivo/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_objetivo(id):
    user_id = get_jwt_identity()
    objetivo = Objetivo.query.get(id)
    if objetivo and objetivo.usuarios_relacion == user_id:
        db.session.delete(objetivo)
        db.session.commit()
        return jsonify({"message": "Objetivo eliminado"}), 200
    else:
        return jsonify({"msg": "Objetivo no encontrado o no tienes permiso para eliminarlo"}), 404

@api.route('/eventos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_evento(id):
    user_id = get_jwt_identity()
    evento = Eventos.query.get(id)
    if evento and evento.usuarios_relacion == user_id:
        db.session.delete(evento)
        db.session.commit()
        return jsonify({"message": "Evento eliminado"}), 200
    else:
        return jsonify({"msg": "Evento no encontrado o no tienes permiso para eliminarlo"}), 404
# Jorge -> fin de los DELETE
