"""empty message

Revision ID: bc11a7645b45
Revises: 1f893421fc52
Create Date: 2024-08-07 19:47:28.632061

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc11a7645b45'
down_revision = '1f893421fc52'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.add_column(sa.Column('reset_token', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('token_expiration', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('usuarios', schema=None) as batch_op:
        batch_op.drop_column('token_expiration')
        batch_op.drop_column('reset_token')

    # ### end Alembic commands ###