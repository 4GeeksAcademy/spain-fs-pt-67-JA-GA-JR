"""empty message

Revision ID: 22bfbe324432
Revises: 
Create Date: 2024-07-20 19:52:27.254607

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '22bfbe324432'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('eventos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('usuarios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('telefono', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('activado', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('telefono')
    )
    op.create_table('alertas_programadas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=True),
    sa.Column('monto', sa.Integer(), nullable=True),
    sa.Column('tipo_movimiento', sa.String(length=120), nullable=True),
    sa.Column('antelacion', sa.Integer(), nullable=False),
    sa.Column('motivo', sa.String(length=120), nullable=False),
    sa.Column('fecha_esperada', sa.Date(), nullable=False),
    sa.Column('usuarios_relacion', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['usuarios_relacion'], ['usuarios.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('objetivo',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('monto', sa.Integer(), nullable=False),
    sa.Column('fecha_objetivo', sa.Date(), nullable=True),
    sa.Column('cuota_mensual', sa.Integer(), nullable=True),
    sa.Column('usuarios_relacion', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['usuarios_relacion'], ['usuarios.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('movimientos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('monto', sa.Integer(), nullable=False),
    sa.Column('tipo_movimiento', sa.String(length=120), nullable=False),
    sa.Column('motivo', sa.String(length=120), nullable=False),
    sa.Column('eventos_relacion', sa.Integer(), nullable=True),
    sa.Column('objetivo_relacion', sa.Integer(), nullable=True),
    sa.Column('fecha', sa.Date(), nullable=False),
    sa.Column('usuarios_relacion', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['eventos_relacion'], ['eventos.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['objetivo_relacion'], ['objetivo.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['usuarios_relacion'], ['usuarios.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('movimientos')
    op.drop_table('objetivo')
    op.drop_table('alertas_programadas')
    op.drop_table('usuarios')
    op.drop_table('eventos')
    # ### end Alembic commands ###