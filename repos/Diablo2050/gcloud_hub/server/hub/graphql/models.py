from sqlalchemy import String, Enum, Boolean, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from hub.database import Column, Model, ForeignKey, relationship, backref, Table, metadata
import strawberry
import re
from hub.auth.models import Organization  # Importing Organization model
import json
import datetime


@strawberry.enum
class SRS(enum.Enum):
    perpetual_powers_of_tau_1  =      "perpetual_powers_of_tau_1"
    perpetual_powers_of_tau_2  =      "perpetual_powers_of_tau_2"
    perpetual_powers_of_tau_3  =      "perpetual_powers_of_tau_3"
    perpetual_powers_of_tau_4  =      "perpetual_powers_of_tau_4"
    perpetual_powers_of_tau_5  =      "perpetual_powers_of_tau_5"
    perpetual_powers_of_tau_6  =      "perpetual_powers_of_tau_6"
    perpetual_powers_of_tau_7  =      "perpetual_powers_of_tau_7"
    perpetual_powers_of_tau_8  =      "perpetual_powers_of_tau_8"
    perpetual_powers_of_tau_9  =      "perpetual_powers_of_tau_9"
    perpetual_powers_of_tau_10 =      "perpetual_powers_of_tau_10"
    perpetual_powers_of_tau_11 =      "perpetual_powers_of_tau_11"
    perpetual_powers_of_tau_12 =      "perpetual_powers_of_tau_12"
    perpetual_powers_of_tau_13 =      "perpetual_powers_of_tau_13"
    perpetual_powers_of_tau_14 =      "perpetual_powers_of_tau_14"
    perpetual_powers_of_tau_15 =      "perpetual_powers_of_tau_15"
    perpetual_powers_of_tau_16 =      "perpetual_powers_of_tau_16"
    perpetual_powers_of_tau_17 =      "perpetual_powers_of_tau_17"
    perpetual_powers_of_tau_18 =      "perpetual_powers_of_tau_18"
    perpetual_powers_of_tau_19 =      "perpetual_powers_of_tau_19"
    perpetual_powers_of_tau_20 =      "perpetual_powers_of_tau_20"
    perpetual_powers_of_tau_21 =      "perpetual_powers_of_tau_21"
    perpetual_powers_of_tau_22 =      "perpetual_powers_of_tau_22"
    perpetual_powers_of_tau_23 =      "perpetual_powers_of_tau_23"
    perpetual_powers_of_tau_24 =      "perpetual_powers_of_tau_24"
    perpetual_powers_of_tau_25 =      "perpetual_powers_of_tau_25"
    perpetual_powers_of_tau_26 =      "perpetual_powers_of_tau_26"

    def get_logrows(self) -> int:
        match = re.search(r'(\d+)$', self.value)
        if match:
            return int(match.group(1))
        raise ValueError("No number found at the end of the enum value.")

    @classmethod
    def get_perpetual_powers_of_tau(cls, value: int):
        return cls(f'perpetual_powers_of_tau_{value}')



@strawberry.enum
class ArtifactType(enum.Enum):
    single = "single"
    aggregate = "aggregate"


@strawberry.enum
class UploadType(enum.Enum):
    model = "model"
    settings = "settings"
    pk = "pk"


# Many to Many relationships between artifact and roles
artifact_view_role_association = Table(
    'artifact_view_role_association',
    metadata,
    Column('artifact_id', UUID(as_uuid=True), ForeignKey('artifact.id')),
    Column('role_id', UUID(as_uuid=True), ForeignKey('role.id'))
)


artifact_edit_role_association = Table(
    'artifact_edit_role_association',
    metadata,
    Column('artifact_id', UUID(as_uuid=True), ForeignKey('artifact.id')),
    Column('role_id', UUID(as_uuid=True), ForeignKey('role.id'))
)


class Artifact(Model):
    __tablename__ = "artifact"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    type = Column(Enum(ArtifactType), nullable=True)
    srs = Column(Enum(SRS), nullable=True)

    uncompiled_model = Column(String, nullable=True)
    uncompiled_model_uploaded = Column(Boolean, default=False)
    uncompiled_model_validated = Column(Boolean, default=False)

    model = Column(String, nullable=True)
    model_uploaded = Column(Boolean, default=False)
    model_validated = Column(Boolean, default=False)

    settings = Column(String, nullable=True)
    settings_uploaded = Column(Boolean, default=False)
    settings_validated = Column(Boolean, default=False)

    pk = Column(String, nullable=True)
    pk_uploaded = Column(Boolean, default=False)
    pk_validated = Column(Boolean, default=False)

    vk = Column(String, nullable=True)
    vk_uploaded = Column(Boolean, default=False)
    vk_validated = Column(Boolean, default=False)

    artifact_validated = Column(Boolean, default=False)

    # one to many relationship within artifacts for aggregated proofs
    parent_id = Column(UUID, ForeignKey("artifact.id"), nullable=True)
    parent = relationship(
        "Artifact",
        primaryjoin="Artifact.id == Artifact.parent_id",
        remote_side=[id],
        backref=backref("children", lazy="dynamic")
    )

    # one to many relationship between artifacts and solidity artifacts
    solidity_artifacts = relationship("SolidityArtifact", backref="artifact")

    # one to many relationship between artifacts and proofs
    proofs = relationship("Proof", backref="artifact")

    # foreign key for the organization
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organization.id'))

    # visibility and editability
    public = Column(Boolean, default=True)
    viewable_by_roles = relationship(
        "Role",
        secondary=artifact_view_role_association,
        backref="viewable_artifacts"
    )
    editable_by_roles = relationship(
        "Role",
        secondary=artifact_edit_role_association,
        backref="editable_artifacts"
    )


    created_at = Column(DateTime, nullable=True, default=datetime.datetime.utcnow)
    # date_modified = Column(DateTime, nullable=True)
    # number_of_proofs_created = Column(Integer, nullable=True, default=0)
    # compute_time_used -> this should be
    # organization -> this should determine scoping
    # permissions and visibility


    def __repr__(self):
        return f'<Artifact id={self.id}, name={self.name}>'


class SolidityArtifact(Model):
    __tablename__ = "solidity_artifact"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    artifact_id = Column(UUID(as_uuid=True), ForeignKey("artifact.id", ondelete="CASCADE"), nullable=False)
    solidity_version = Column(String, nullable=True)
    evm_version = Column(String, nullable=True)
    optimizer_enabled = Column(Boolean, default=False)
    optimizer_runs = Column(Integer, nullable=True)
    solidity_code = Column(String, nullable=True)
    byte_code = Column(String, nullable=True)
    abi = Column(String, nullable=True)

    def __repr__(self):
        return f'<SolidityArtifact id={self.id} solidityVersion=${self.solidity_version} evmVersion={self.evm_version}>'


class Proof(Model):
    __tablename__ = "proof"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    artifact_id = Column(UUID(as_uuid=True), ForeignKey("artifact.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, nullable=True, default=datetime.datetime.utcnow)
    time_taken = Column(Integer, nullable=True)
    status = Column(String, nullable=True, default="PENDING")
    proof = Column(String, nullable=True)
    # stored as a serialized array as a string
    _instances = Column(String, nullable=True)
    transcript_type = Column(String, nullable=True)
    strategy = Column(String, nullable=True)

    # one to many relationship within proofs for aggregated proofs
    parent_id = Column(UUID, ForeignKey("proof.id"), nullable=True)
    parent = relationship(
        "Proof",
        primaryjoin="Proof.id == Proof.parent_id",
        remote_side=[id],
        backref=backref("children", lazy="dynamic")
    )

    @property
    def instances(self):
        return json.loads(self._instances)

    @instances.setter
    def instances(self, value):
        self._instances = json.dumps(value)