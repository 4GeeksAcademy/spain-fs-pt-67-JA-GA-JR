from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, ForeignKey, Enum, Integer, String, Date
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import create_engine


db = SQLAlchemy()

class Usuarios(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    telefono = db.Column(db.Integer, unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    activado = db.Column(db.Boolean(), nullable=False, default=True)

    def __repr__(self):
        return '<Usuario %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "telefono": self.telefono,
            "email": self.email
            # do not serialize the password, its a security breach
        }

class Eventos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre
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
    eventos_relacion = db.Column(db.Integer,db.ForeignKey(Eventos.id, ondelete='CASCADE'))
    objetivo_relacion = db.Column(db.Integer,db.ForeignKey(Objetivo.id, ondelete='CASCADE'))
    fecha = db.Column(db.Date, nullable=True)
    usuarios_relacion = db.Column(db.Integer,db.ForeignKey(Usuarios.id, ondelete='CASCADE'))

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

