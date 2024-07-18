import os
from flask_admin import Admin
from .models import db, Usuarios, Movimientos, Alertas_programadas, Objetivo, Eventos
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Usuarios, db.session))
    admin.add_view(ModelView(Movimientos, db.session))
    admin.add_view(ModelView(Alertas_programadas, db.session))
    admin.add_view(ModelView(Objetivo, db.session))
    admin.add_view(ModelView(Eventos, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))