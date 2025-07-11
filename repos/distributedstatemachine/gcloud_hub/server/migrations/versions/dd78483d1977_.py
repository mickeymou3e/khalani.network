"""empty message

Revision ID: dd78483d1977
Revises: 063c633efba3
Create Date: 2023-08-14 19:58:14.886214

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'dd78483d1977'
down_revision = '063c633efba3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    artifact_type = postgresql.ENUM('single', 'aggregate', name='artifacttype')
    artifact_type.create(op.get_bind())

    with op.batch_alter_table('artifact', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type', sa.Enum('single', 'aggregate', name='artifacttype'), nullable=True, server_default="single"))
        batch_op.add_column(sa.Column('model_uploaded', sa.Boolean(), nullable=True, server_default="true"))
        batch_op.add_column(sa.Column('model_validated', sa.Boolean(), nullable=True, server_default="true"))
        batch_op.add_column(sa.Column('settings_uploaded', sa.Boolean(), nullable=True, server_default="true"))
        batch_op.add_column(sa.Column('settings_validated', sa.Boolean(), nullable=True, server_default="true"))
        batch_op.add_column(sa.Column('pk_uploaded', sa.Boolean(), nullable=True, server_default="true"))
        batch_op.add_column(sa.Column('pk_validated', sa.Boolean(), nullable=True, server_default="true"))
        batch_op.add_column(sa.Column('vk', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('vk_uploaded', sa.Boolean(), nullable=True, server_default="false"))
        batch_op.add_column(sa.Column('vk_validated', sa.Boolean(), nullable=True, server_default="false"))
        batch_op.add_column(sa.Column('artifact_validated', sa.Boolean(), nullable=True, server_default="true"))
        batch_op.add_column(sa.Column('parent_id', sa.UUID(), nullable=True))
        batch_op.create_foreign_key(None, 'artifact', ['parent_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    artifact_type = postgresql.ENUM('single', 'aggregate', name='artifacttype')
    artifact_type.drop(op.get_bind())

    with op.batch_alter_table('artifact', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('parent_id')
        batch_op.drop_column('artifact_validated')
        batch_op.drop_column('vk_validated')
        batch_op.drop_column('vk_uploaded')
        batch_op.drop_column('vk')
        batch_op.drop_column('pk_validated')
        batch_op.drop_column('pk_uploaded')
        batch_op.drop_column('settings_validated')
        batch_op.drop_column('settings_uploaded')
        batch_op.drop_column('model_validated')
        batch_op.drop_column('model_uploaded')
        batch_op.drop_column('type')
        batch_op.drop_type("artifacttype")

    # ### end Alembic commands ###
