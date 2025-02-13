"""empty message

Revision ID: 6841f605e312
Revises: 9ddcb37c1aaa
Create Date: 2024-07-19 20:01:28.102987

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6841f605e312'
down_revision = '9ddcb37c1aaa'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('objetivo', schema=None) as batch_op:
        batch_op.alter_column('usuarios_relacion',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('objetivo', schema=None) as batch_op:
        batch_op.alter_column('usuarios_relacion',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
