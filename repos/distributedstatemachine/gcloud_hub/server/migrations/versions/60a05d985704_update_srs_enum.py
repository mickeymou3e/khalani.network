"""update srs enum

Revision ID: 60a05d985704
Revises: 2fdb20effc3f
Create Date: 2023-09-08 05:57:23.969094

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '60a05d985704'
down_revision = '2fdb20effc3f'
branch_labels = None
depends_on = None


def upgrade():
    new_srs_enum = sa.Enum(
        'perpetual_powers_of_tau_1',
        'perpetual_powers_of_tau_2',
        'perpetual_powers_of_tau_3',
        'perpetual_powers_of_tau_4',
        'perpetual_powers_of_tau_5',
        'perpetual_powers_of_tau_6',
        'perpetual_powers_of_tau_7',
        'perpetual_powers_of_tau_8',
        'perpetual_powers_of_tau_9',
        'perpetual_powers_of_tau_10',
        'perpetual_powers_of_tau_11',
        'perpetual_powers_of_tau_12',
        'perpetual_powers_of_tau_13',
        'perpetual_powers_of_tau_14',
        'perpetual_powers_of_tau_15',
        'perpetual_powers_of_tau_16',
        'perpetual_powers_of_tau_17',
        'perpetual_powers_of_tau_18',
        'perpetual_powers_of_tau_19',
        'perpetual_powers_of_tau_20',
        'perpetual_powers_of_tau_21',
        'perpetual_powers_of_tau_22',
        'perpetual_powers_of_tau_23',
        'perpetual_powers_of_tau_24',
        'perpetual_powers_of_tau_25',
        'perpetual_powers_of_tau_26',
        name='new_srs_enum',
    )

    new_srs_enum.create(op.get_bind())


    # Create a temporary enum column in the 'artifact' table
    op.add_column('artifact', sa.Column('temp_srs', new_srs_enum, nullable=True))

    # Copy values from old column to temporary column
    op.execute('UPDATE artifact SET temp_srs = srs::text::new_srs_enum')

    # Drop old column
    op.drop_column('artifact', 'srs')

    # Rename temporary column to original name
    op.alter_column('artifact', 'temp_srs', new_column_name='srs')

    # Drop old enum type
    op.execute('DROP TYPE srs')

    # Rename new enum type to original name
    op.execute('ALTER TYPE new_srs_enum RENAME TO srs')


def downgrade():
    # No downgrades for this migration
    # due to the need to edit columns
    pass
