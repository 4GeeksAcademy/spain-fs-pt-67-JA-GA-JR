from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Enum, Integer, String, Date
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import create_engine
from datetime import datetime, timedelta
import bcrypt


db = SQLAlchemy()

class Usuarios(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    telefono = db.Column(db.Integer, unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    foto_perfil_url = db.Column(db.String(255), nullable=True)
    activado = db.Column(db.Boolean(), nullable=False, default=True)
    reset_token = db.Column(db.String(120), nullable=True)
    token_expiration = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return '<Usuario %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "telefono": self.telefono,
            "email": self.email,
            "foto_perfil_url": self.foto_perfil_url
            # do not serialize the password, its a security breach
        }
    
    def generate_reset_token(self):
        self.reset_token = bcrypt.gensalt().decode()
        self.token_expiration = datetime.utcnow() + timedelta(hours=1)

    def verify_reset_token(self, token):
        return self.reset_token == token and self.token_expiration > datetime.utcnow()

class Eventos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    usuarios_relacion = db.Column(db.Integer, db.ForeignKey(Usuarios.id, ondelete='CASCADE'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "usuarios_relacion": self.usuarios_relacion
        }
    
class Objetivo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    monto = db.Column(db.Integer, nullable=False)
    fecha_objetivo = db.Column(db.Date, nullable=True)
    cuota_mensual = db.Column(db.Integer, nullable=True)
    usuarios_relacion = db.Column(db.Integer,db.ForeignKey(Usuarios.id, ondelete='CASCADE'))

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "monto": self.monto,
            "fecha_objetivo": self.fecha_objetivo,
            "cuota_mensual": self.cuota_mensual,
            "usuarios_relacion": self.usuarios_relacion
        }
    
class Movimientos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    monto = db.Column(db.Integer, nullable=False)
    tipo_movimiento = db.Column(db.String(120), nullable=False)
    motivo = db.Column(db.String(120), nullable=False)
    eventos_relacion = db.Column(db.Integer, db.ForeignKey(Eventos.id, ondelete='CASCADE'), nullable=True)
    objetivo_relacion = db.Column(db.Integer, db.ForeignKey(Objetivo.id, ondelete='CASCADE'), nullable=True)
    fecha = db.Column(db.Date, nullable=False)
    usuarios_relacion = db.Column(db.Integer, db.ForeignKey(Usuarios.id, ondelete='CASCADE'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "monto": self.monto,
            "tipo_movimiento": self.tipo_movimiento,
            "motivo": self.motivo,
            "eventos_relacion": self.eventos_relacion,
            "objetivo_relacion": self.objetivo_relacion,
            "fecha": self.fecha,
            "usuarios_relacion": self.usuarios_relacion
        }

class Alertas_programadas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=True)
    monto = db.Column(db.Integer, nullable=True)
    tipo_movimiento = db.Column(db.String(120), nullable=True)
    antelacion = db.Column(db.Integer, nullable=False)
    motivo = db.Column(db.String(120), nullable=False)
    fecha_esperada = db.Column(db.Date, nullable=False)
    usuarios_relacion = db.Column(db.Integer,db.ForeignKey(Usuarios.id, ondelete='CASCADE'))

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "monto": self.monto,
            "tipo_movimiento": self.tipo_movimiento,
            "antelacion": self.antelacion,
            "motivo": self.motivo,
            "fecha_esperada": self.fecha_esperada,
            "usuarios_relacion": self.usuarios_relacion
        }  
