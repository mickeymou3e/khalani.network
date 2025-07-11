# import strawberry
# from datetime import datetime
# from uuid import uuid4
# from main import db

from flask import Blueprint, jsonify
from typing import List, Optional, TypeVar
import strawberry
from strawberry.flask.views import GraphQLView
from strawberry.file_uploads import Upload
import os
import shutil

from .models import Artifact as model_Artifact
from .models import SRS, ArtifactType, UploadType
from .models import Proof as model_Proof
from celery.result import AsyncResult
import uuid
from celery import uuid as celery_uuid, chord
from ..celeryapp import (
    celery,
    prove,
    prove_aggregate,
    validate,
    generate_solidity_code,
    generate_artifact,
    generate_aggregate_artifact,
)
from .utils import is_valid_ezkl_version
from hub.auth.utils import current_user
from hub.auth.models import Organization as model_Organization, User as model_User
import datetime

import uuid


blueprint = Blueprint("graphql", __name__, url_prefix="/", static_folder="static")

ENV = os.getenv("ENV")
# if ENV in ["STAGING", "PRODUCTION"]:
#     ARTIFACT_PATH = "/usr/artifacts"
# else:
#     ARTIFACT_PATH = os.path.join(os.getcwd(), "artifact")

ARTIFACT_PATH = os.path.join(os.getcwd(), "artifact")
T = TypeVar("T")

# @strawberry.input
# class Filter(Generic[T]):
#     eq: Optional[T] = None
#     gt: Optional[T] = None
#     lt: Optional[T] = None


# @strawberry.input
# class ArtifactFilter:
#     id: Optional[Filter[str]] = None
#     name: Optional[Filter[str]] = None
#     description: Optional[Filter[str]] = None
#     kzg_params: Optional[Filter[str]] = None
#     model: Optional[Filter[str]] = None
#     settings: Optional[Filter[str]] = None
#     pk: Optional[Filter[str]] = None


@strawberry.type
class Artifact:
    id: uuid.UUID
    name: str
    description: str
    type: ArtifactType
    srs: Optional[SRS]

    uncompiled_model: Optional[str]
    uncompiled_model_uploaded: Optional[bool]
    uncompiled_model_validated: Optional[bool]

    model: Optional[str]
    model_uploaded: Optional[bool]
    model_validated: Optional[bool]

    settings: Optional[str]
    settings_uploaded: Optional[bool]
    settings_validated: Optional[bool]

    pk: Optional[str]
    pk_uploaded: Optional[bool]
    pk_validated: Optional[bool]

    vk: Optional[str]
    vk_uploaded: Optional[bool]
    vk_validated: Optional[bool]

    artifact_validated: Optional[bool]

    parent: Optional["Artifact"]
    children: Optional[List["Artifact"]]

    solidity_artifacts: Optional[List["SolidityArtifact"]]
    organization: Optional["Organization"]

    proofs: Optional[List["Proof"]]


@strawberry.type
class SolidityArtifact:
    id: uuid.UUID
    artifact: Artifact
    solidity_version: Optional[str]
    evm_version: Optional[str]
    optimizer_enabled: Optional[bool]
    optimizer_runs: Optional[int]
    solidity_code: Optional[str]
    byte_code: Optional[str]
    abi: Optional[str]


@strawberry.type
class Proof:
    id: uuid.UUID
    artifact: Optional[Artifact]
    time_taken: Optional[int]
    status: str
    proof: Optional[str]
    instances: Optional[list[str]]
    transcript_type: Optional[str]
    strategy: Optional[str]
    parent: Optional["Proof"]
    children: Optional[List["Proof"]]


@strawberry.type
class GenerateTask:
    artifact: Artifact
    taskId: uuid.UUID
    status: str


@strawberry.type
class User:
    id: uuid.UUID
    username: str
    avatar_url: str
    created_at: datetime.datetime
    # organizations: List["Organization"]


@strawberry.type
class Organization:
    id: uuid.UUID
    name: str
    default_organization: bool
    default_organization_of_user: Optional[uuid.UUID]
    users: Optional[List[User]]
    artifacts: Optional[List["Artifact"]]


@strawberry.type
class Query:
    @strawberry.field
    def artifacts(
        self,
        info,
        first: int = 10,
        skip: int = 0,
    ) -> Optional[List[Artifact]]:
        results = model_Artifact.query.offset(skip).limit(first)
        return results

    @strawberry.field
    def artifact(
        self,
        info,
        id: str,
    ) -> Optional[Artifact]:
        artifact = model_Artifact.query.filter_by(id=id).first()

        return artifact

    @strawberry.field
    def organizations(
        self,
        info,
        first: int = 10,
        skip: int = 0,
    ) -> Optional[List[Organization]]:
        results = model_Organization.query.offset(skip).limit(first)
        return results

    @strawberry.field
    def organization(
        self,
        info,
        id: str,
    ) -> Optional[Organization]:
        org = model_Organization.query.filter_by(id=id).first()

        return org

    @strawberry.field
    def users(
        self,
        info,
        first: int = 10,
        skip: int = 0,
    ) -> Optional[List[User]]:
        results = model_User.query.offset(skip).limit(first)
        return results

    @strawberry.field
    def user(
        self,
        info,
        id: str,
    ) -> Optional[User]:
        org = model_User.query.filter_by(id=id).first()

        return org

    @strawberry.field
    def get_proof(self, info, id: str) -> Optional[Proof]:
        proof = model_Proof.query.filter_by(id=id).first()

        return proof


@strawberry.type
class Mutation:
    @strawberry.field
    def upload_artifact_legacy(
        self,
        info,
        name: Optional[str],
        description: Optional[str],
        srs: SRS,
        model: Upload,
        settings: Upload,
        pk: Upload,
        organizationId: Optional[str] = None,
    ) -> Artifact:
        # checks

        # check if user is login
        user = current_user()
        if user is None:
            raise Exception("Please login before uploading your artifacts")

        # check if user belongs to organization if org_id is specified
        if organizationId is not None:
            organization = model_Organization.query.filter_by(id=organizationId).first()

            if not organization:
                raise Exception("The specified organization does not exist.")

            if organization not in user.organizations:
                raise Exception(
                    "The user is not a member of the specified organization."
                )

        if organizationId is None:
            organization = model_Organization.query.filter_by(
                default_organization_of_user=user.id
            ).first()

        new_uuid = uuid.uuid4()
        # TODO: Migrate to S3 or some other file storage CDN eventually
        # create a folder in artifact
        uuid_path = os.path.join(ARTIFACT_PATH, str(new_uuid))
        temp_path = os.path.join(uuid_path, "temp")

        # create the directory
        os.mkdir(uuid_path)
        os.mkdir(temp_path)

        # store files in the directory
        model.save(os.path.join(uuid_path, "network.ezkl"))
        settings.save(os.path.join(uuid_path, "settings.json"))
        pk.save(os.path.join(uuid_path, "pk.key"))

        artifact = model_Artifact.create(
            id=new_uuid,
            name=str(new_uuid) if name is None else name,
            description=str(new_uuid) if description is None else description,
            srs=srs.name,
            type="single",
            model=str(new_uuid) + "/network.ezkl",
            model_uploaded=True,
            settings=str(new_uuid) + "/settings.json",
            settings_uploaded=True,
            pk=str(new_uuid) + "/pk.key",
            pk_uploaded=True,
            vk=str(new_uuid) + "/vk.key",
            organization_id=organization.id,
        )

        return artifact

    @strawberry.field
    def register_artifact(
        self,
        info,
        name: Optional[str],
        description: Optional[str],
        type: ArtifactType,
        srs: SRS,
        parent_id: Optional[str] = None,
    ) -> Artifact:
        new_uuid = uuid.uuid4()
        # TODO: Migrate to S3 or some other file storage CDN eventually

        # create a folder in artifact
        uuid_path = os.path.join(ARTIFACT_PATH, str(new_uuid))
        temp_path = os.path.join(uuid_path, "temp")

        # create the directory
        os.mkdir(uuid_path)
        os.mkdir(temp_path)

        # create db entry
        # create a bunch of file pointers first
        if type == ArtifactType.single:
            artifact = model_Artifact.create(
                id=new_uuid,
                name=str(new_uuid) if name is None else name,
                description=str(new_uuid) if description is None else description,
                type=type.name,
                srs=srs.name,
                model=str(new_uuid) + "/network.ezkl",
                settings=str(new_uuid) + "/settings.json",
                pk=str(new_uuid) + "/pk.key",
                vk=str(new_uuid) + "/vk.key",
                parent_id=None,
            )

        if type == ArtifactType.aggregate:
            artifact = model_Artifact.create(
                id=new_uuid,
                name=str(new_uuid) if name is None else name,
                description=str(new_uuid) if description is None else description,
                type=type.name,
                srs=srs.name,
                pk=str(new_uuid) + "/pk.key",
                vk=str(new_uuid) + "/vk.key",
                parent_id=None,
            )

        # Update parent_id if it exists
        if parent_id:
            parent_artifact = model_Artifact.query.filter_by(id=parent_id).first()

            if parent_artifact:
                # parent_artifact.children.append(artifact)
                artifact.parent = parent_artifact

                artifact.save()

        return artifact

    @strawberry.field
    def upload_artifact_files(
        self,
        info,
        id: str,
        uploadType: UploadType,
        chunkNumber: int,
        chunkTotal: int,
        fileChunk: Upload,
    ) -> Artifact:
        def check_chunk_complete(ct, p, suffix):
            for i in range(1, ct + 1):
                filename = os.path.join(p, str(i) + "_" + str(ct) + "_" + suffix)

                if not os.path.exists(filename):
                    return False

            return True

        def join_files(ct, p, suffix):
            output_file = os.path.join(p, suffix)
            # Creates a new file
            with open(output_file, "wb") as out:
                for i in range(1, ct + 1):
                    filename = os.path.join(p, str(i) + "_" + str(ct) + "_" + suffix)

                    try:
                        with open(filename, "rb") as input_file:
                            shutil.copyfileobj(input_file, out)

                        # remove file after copying
                        os.remove(filename)

                    except FileNotFoundError:
                        raise Exception("Missing chunk")

        # store files in the directory
        uuid_path = os.path.join(ARTIFACT_PATH, str(id))
        artifact = model_Artifact.query.filter_by(id=id).first()

        if chunkNumber == 0:
            raise Exception("chunkNumber is 1 indexed")

        if chunkNumber > chunkTotal:
            raise Exception("chunkNumber exceeds chunkTotal")

        if uploadType == UploadType.model:
            if chunkTotal > 1:
                fileChunk.save(
                    os.path.join(
                        uuid_path,
                        str(chunkNumber) + "_" + str(chunkTotal) + "_network.ezkl",
                    )
                )

                # Check if all file chunks are available
                if check_chunk_complete(chunkTotal, uuid_path, "network.ezkl"):
                    join_files(chunkTotal, uuid_path, "network.ezkl")
                    artifact.model_uploaded = True

            else:
                fileChunk.save(os.path.join(uuid_path, "network.ezkl"))
                artifact.model_uploaded = True

        elif uploadType == UploadType.settings:
            if chunkTotal > 1:
                fileChunk.save(
                    os.path.join(
                        uuid_path,
                        str(chunkNumber) + "_" + str(chunkTotal) + "_settings.json",
                    )
                )

                if check_chunk_complete(chunkTotal, uuid_path, "settings.json"):
                    join_files(chunkTotal, uuid_path, "settings.json")
                    artifact.settings_uploaded = True
            else:
                fileChunk.save(os.path.join(uuid_path, "settings.json"))
                artifact.settings_uploaded = True

        else:
            if chunkTotal > 1:
                fileChunk.save(
                    os.path.join(
                        uuid_path, str(chunkNumber) + "_" + str(chunkTotal) + "_pk.key"
                    )
                )

                if check_chunk_complete(chunkTotal, uuid_path, "pk.key"):
                    join_files(chunkTotal, uuid_path, "pk.key")
                    artifact.pk_uploaded = True
            else:
                fileChunk.save(os.path.join(uuid_path, "pk.key"))
                artifact.pk_uploaded = True

        artifact.save()
        return artifact

    @strawberry.field
    def initiate_proof(
        self,
        info,
        id: str,
        input: Upload,
        transcriptType: Optional[str] = "evm",
    ) -> Optional[Proof]:
        # save input to temporary folder
        temp_uuid = celery_uuid()
        input_path = os.path.join(
            ARTIFACT_PATH, id, "temp", str(temp_uuid) + "_input" + ".json"
        )
        input.save(input_path)

        artifact_data = model_Artifact.query.filter_by(id=id).first()

        if artifact_data.type == ArtifactType.single:
            model_path = os.path.join(ARTIFACT_PATH, artifact_data.model)
            settings_path = os.path.join(ARTIFACT_PATH, artifact_data.settings)
            pk_path = os.path.join(ARTIFACT_PATH, artifact_data.pk)
            srs_path = os.path.join(
                ARTIFACT_PATH, "srs", artifact_data.srs.value + ".srs"
            )

            task = prove.apply_async(
                (
                    temp_uuid,
                    id,
                    input_path,
                    model_path,
                    settings_path,
                    pk_path,
                    srs_path,
                    transcriptType,
                    "single",
                ),
                task_id=temp_uuid,
            )

            return Proof(
                id=task.id,
                artifact=artifact_data,
                time_taken=None,
                status=task.status,
                proof=None,
                instances=None,
                transcript_type=transcriptType,
                strategy="single",
                parent=None,
                children=None,
            )

        elif artifact_data.type == ArtifactType.aggregate:
            # TODO Throw an error and ask users to use the initiate aggregate proof endpoint
            raise Exception(
                "Aggregated proofs are not supported on this call, use initiateAggregateProof instead."
            )
        else:
            raise Exception(
                "Something went wrong! It looks like there is an unknown artifact type? Please contact the maintainers about this."
            )

    @strawberry.field
    def initiate_aggregate_proof(
        self,
        info,
        id: str,
        childId: List[str],
        input: List[Upload],
    ) -> Optional[Proof]:
        if len(childId) != len(input):
            raise Exception(
                "childId and input lengths are not equal. Make sure the order of inputs correspond to the order of childIds"
            )

        else:
            # only deal with one layer aggregation
            childTasks = []
            header = []
            for i in range(len(childId)):
                # save input to temporary folder of childId
                temp_uuid = celery_uuid()
                input_path = os.path.join(
                    ARTIFACT_PATH,
                    childId[i],
                    "temp",
                    str(temp_uuid) + "_input" + ".json",
                )
                input[i].save(input_path)

                artifact_data = model_Artifact.query.filter_by(id=childId[i]).first()

                if artifact_data.type == ArtifactType.aggregate:
                    raise Exception(
                        "Aggregated proofs are not supported beyond one layer. Please contact the ezkl team if you wish to have more layers."
                    )

                else:
                    model_path = os.path.join(ARTIFACT_PATH, artifact_data.model)
                    settings_path = os.path.join(ARTIFACT_PATH, artifact_data.settings)
                    pk_path = os.path.join(ARTIFACT_PATH, artifact_data.pk)
                    srs_path = os.path.join(
                        ARTIFACT_PATH, "srs", artifact_data.srs.value + ".srs"
                    )

                    # task = prove.apply_async(
                    #     (
                    #         temp_uuid,
                    #         i,
                    #         input_path,
                    #         model_path,
                    #         settings_path,
                    #         pk_path,
                    #         srs_path,
                    #         "poseidon", # use poseidon in this case because we will aggregate them
                    #         "single",
                    #     ),
                    #     task_id=temp_uuid
                    # )

                    header.append(
                        prove.s(
                            temp_uuid,
                            childId[i],
                            input_path,
                            model_path,
                            settings_path,
                            pk_path,
                            srs_path,
                            "poseidon",
                            "accum",
                        ).set(task_id=temp_uuid)
                    )

                    childTasks.append(
                        Proof(
                            artifact=artifact_data,
                            id=temp_uuid,
                            status="PENDING",
                            proof=None,
                            instances=None,
                            transcriptType="poseidon",
                            strategy="accum",
                            children=None,
                        )
                    )

            # Run the aggregate task
            temp_uuid = celery_uuid()
            artifact_data = model_Artifact.query.filter_by(id=id).first()
            nb = {
                "artifactId": artifact_data.id,
                "taskId": temp_uuid,
                "pk": os.path.join(ARTIFACT_PATH, artifact_data.pk),
                "srs_path": os.path.join(
                    ARTIFACT_PATH, "srs", artifact_data.srs.value + ".srs"
                ),
                "logrows": artifact_data.srs.get_logrows(),
            }
            callback = prove_aggregate.s(nb).set(task_id=temp_uuid)
            task = chord(header)(callback)

            return Proof(
                artifact=artifact_data,
                id=task.id,
                status=task.status,
                proof=None,
                instances=None,
                transcriptType="EVM",
                strategy="aggregate",
                children=childTasks,
            )

    @strawberry.field
    def validate(
        self,
        info,
        id: str,
        input: Upload,
    ) -> GenerateTask:
        artifact_data = model_Artifact.query.filter_by(id=id).first()

        if artifact_data.artifact_validated:
            raise Exception(
                "You have already validated the artifact there is no need to call validate again."
            )

        temp_uuid = celery_uuid()

        input_path = os.path.join(
            ARTIFACT_PATH, id, "temp", str(temp_uuid) + "_input" + ".json"
        )
        input.save(input_path)

        if artifact_data.type == ArtifactType.single:
            settings_path = os.path.join(ARTIFACT_PATH, artifact_data.settings)
            pk_path = os.path.join(ARTIFACT_PATH, artifact_data.pk)

            model_path = os.path.join(ARTIFACT_PATH, artifact_data.model)
            settings_path = os.path.join(ARTIFACT_PATH, artifact_data.settings)
            pk_path = os.path.join(ARTIFACT_PATH, artifact_data.pk)
            if artifact_data.vk is not None:
                vk_path = os.path.join(ARTIFACT_PATH, artifact_data.vk)
            else:
                vk_path = os.path.join(id, "vk.key")
                artifact_data.vk = vk_path
                artifact_data.save()
                vk_path = os.path.join(ARTIFACT_PATH, vk_path)

            srs_path = os.path.join(
                ARTIFACT_PATH, "srs", artifact_data.srs.value + ".srs"
            )

            task = validate.apply_async(
                (
                    temp_uuid,
                    id,
                    input_path,
                    model_path,
                    settings_path,
                    pk_path,
                    vk_path,
                    srs_path,
                ),
                task_id=temp_uuid,
            )

            return GenerateTask(
                artifact=artifact_data, taskId=task.id, status=task.status
            )

        elif artifact_data.type == ArtifactType.aggregate:
            raise Exception(
                "To validate aggregate setups you will want to call validateAggregate instead."
            )

        else:
            raise Exception(
                "Something went wrong! It looks like there is an unknown artifact type? Please contact the maintainers about this."
            )

    @strawberry.field
    def generate_solidity_code(
        self,
        info,
        id: str,
    ) -> GenerateTask:
        artifact_data = model_Artifact.query.filter_by(id=id).first()

        if not artifact_data.artifact_validated:
            raise Exception(
                "The artifact is not yet validated, you need to call validate prior to calling generateSolidityCode."
            )

        temp_uuid = celery_uuid()

        if artifact_data.type == ArtifactType.single:
            settings_path = os.path.join(ARTIFACT_PATH, artifact_data.settings)
            vk_path = os.path.join(ARTIFACT_PATH, artifact_data.vk)
            settings_path = os.path.join(ARTIFACT_PATH, artifact_data.settings)
            srs_path = os.path.join(
                ARTIFACT_PATH, "srs", artifact_data.srs.value + ".srs"
            )

            task = generate_solidity_code.apply_async(
                (
                    temp_uuid,
                    id,
                    vk_path,
                    srs_path,
                    settings_path,
                ),
                task_id=temp_uuid,
            )

            return GenerateTask(
                artifact=artifact_data, taskId=task.id, status=task.status
            )

        elif artifact_data.type == ArtifactType.aggregate:
            pass

        else:
            raise Exception(
                "Something went wrong! It looks like there is an unknown artifact type? Please contact the maintainers about this."
            )

    @strawberry.field
    def generate_artifact(
        self,
        info,
        name: Optional[str],
        description: Optional[str],
        uncompiledModel: Upload,
        input: Upload,
        ezklVersion: Optional[str] = "latest",
        calibrationTarget: Optional[str] = "resources",
        tolerance: Optional[float] = 0.0,
        inputScale: Optional[int] = 7,
        paramScale: Optional[int] = 7,
        scaleRebaseMultiplier: Optional[int] = 2,
        bits: Optional[int] = 16,
        logrows: Optional[int] = 17,
        inputVisibility: Optional[str] = "public",
        outputVisibility: Optional[str] = "public",
        paramVisibility: Optional[str] = "private",
        organizationId: Optional[str] = None,
    ) -> GenerateTask:
        # check if user is login
        user = current_user()
        if user is None:
            raise Exception("Please login before uploading your artifacts")

        # check if user belongs to organization if org_id is specified
        if organizationId is not None:
            organization = model_Organization.query.filter_by(id=organizationId).first()

            if not organization:
                raise Exception("The specified organization does not exist.")

            if organization not in user.organizations:
                raise Exception(
                    "The user is not a member of the specified organization."
                )

        if organizationId is None:
            organization = model_Organization.query.filter_by(
                default_organization_of_user=user.id
            ).first()

        # check if ezkl version is valid
        if not is_valid_ezkl_version(ezklVersion):
            raise Exception(
                "Please provide a valid ezkl version. The ezkl hub supports ezkl version >=1.11.5."
            )

        # check calibration target
        if calibrationTarget not in ("accuracy", "resources"):
            raise Exception(
                "calibrationTarget should be accuracy or resources. You have provided an invalid value."
            )

        visibility_set = (
            "public",
            "private",
            "hashed",
            "hashed/public",
            "hashed/private",
            "encrypted",
        )

        # check for visibility
        if inputVisibility not in visibility_set:
            raise Exception(
                "Please provide a valid visiblity for inputVisibility. Valid values are public, private, hashed, hashed/public, hashed/private, encrypted"
            )

        if outputVisibility not in visibility_set:
            raise Exception(
                "Please provide a valid visiblity for outputVisibility. Valid values are public, private, hashed, hashed/public, hashed/private, encrypted"
            )

        if paramVisibility not in visibility_set:
            raise Exception(
                "Please provide a valid visiblity for paramVisibility. Valid values are public, private, hashed, hashed/public, hashed/private, encrypted"
            )

        new_uuid = uuid.uuid4()

        uuid_path = os.path.join(ARTIFACT_PATH, str(new_uuid))
        temp_path = os.path.join(uuid_path, "temp")

        # create the directory
        os.mkdir(uuid_path)
        os.mkdir(temp_path)

        # save uncompiled model
        uncompiledModel.save(os.path.join(uuid_path, "network.onnx"))

        # save temp input
        temp_uuid = celery_uuid()
        input_path = os.path.join(
            ARTIFACT_PATH, str(new_uuid), "temp", str(temp_uuid) + "_input" + ".json"
        )
        input.save(input_path)

        # create artifact
        artifact = model_Artifact.create(
            id=new_uuid,
            name=str(new_uuid) if name is None else name,
            description=str(new_uuid) if description is None else description,
            type="single",
            uncompiled_model=str(new_uuid) + "/network.onnx",
            uncompiled_model_uploaded=True,
        )

        logger.info(f"CELERY_BROKER_URL: {celery.conf.broker_url}")
        logger.info("Calling generate_artifact task")

        task = generate_artifact.apply_async(
            (
                str(temp_uuid),
                str(new_uuid),
                ezklVersion,
                input_path,
                calibrationTarget,
                tolerance,
                inputScale,
                paramScale,
                scaleRebaseMultiplier,
                bits,
                logrows,
                inputVisibility,
                outputVisibility,
                paramVisibility,
                organization.id,
            ),
            task_id=temp_uuid,
        )

        logger.info(f"Task ID: {task.id}, Status: {task.status}")


        return GenerateTask(artifact=artifact, taskId=task.id, status=task.status)

    @strawberry.field
    def generate_aggregate_artifact(
        self,
        info,
        logrows: int,
        name: Optional[str],
        description: Optional[str],
        input: List[Upload],
        childId: List[str],
        organizationId: Optional[str] = None,
    ) -> GenerateTask:
        # check if user is login
        user = current_user()
        if user is None:
            raise Exception("Please login before uploading your artifacts")

        # check if user belongs to organization if org_id is specified
        if organizationId is not None:
            organization = model_Organization.query.filter_by(id=organizationId).first()

            if not organization:
                raise Exception("The specified organization does not exist.")

            if organization not in user.organizations:
                raise Exception(
                    "The user is not a member of the specified organization."
                )

        if organizationId is None:
            organization = model_Organization.query.filter_by(
                default_organization_of_user=user.id
            ).first()

        if len(childId) != len(input):
            raise Exception(
                "childId and input lengths are not equal. Make sure the order of inputs correspond to the order of childIds"
            )
        else:
            # create parent aggregate artifact
            new_uuid = uuid.uuid4()
            artifact = model_Artifact.create(
                id=new_uuid,
                name=str(new_uuid) if name is None else name,
                description=str(new_uuid) if description is None else description,
                type="aggregate",
                pk=str(new_uuid) + "/pk.key",
                vk=str(new_uuid) + "/vk.key",
            )
            artifact.save()

            # setup path for the aggregate artifact
            uuid_path = os.path.join(ARTIFACT_PATH, str(new_uuid))
            temp_path = os.path.join(uuid_path, "temp")

            # create the directory
            os.mkdir(uuid_path)
            os.mkdir(temp_path)

            # childTasks = []
            header = []

            # generate proofs for children
            for i in range(len(childId)):
                # save input to temporary folder of childId
                temp_uuid = celery_uuid()
                input_path = os.path.join(
                    ARTIFACT_PATH,
                    childId[i],
                    "temp",
                    str(temp_uuid) + "_input" + ".json",
                )
                input[i].save(input_path)

                artifact_data = model_Artifact.query.filter_by(id=childId[i]).first()

                # link child to parent
                if artifact_data.parent_id is not None:
                    raise Exception(
                        "Child artifact already has a parent, you should create another child artifact for the aggregation."
                    )
                artifact_data.parent_id = new_uuid
                artifact_data.save()

                if artifact_data.type == ArtifactType.aggregate:
                    raise Exception(
                        "Aggregated proofs are not supported beyond one layer. Please contact the ezkl team if you wish to have more layers."
                    )

                else:
                    model_path = os.path.join(ARTIFACT_PATH, artifact_data.model)
                    settings_path = os.path.join(ARTIFACT_PATH, artifact_data.settings)
                    pk_path = os.path.join(ARTIFACT_PATH, artifact_data.pk)
                    srs_path = os.path.join(
                        ARTIFACT_PATH, "srs", artifact_data.srs.value + ".srs"
                    )

                    header.append(
                        prove.s(
                            temp_uuid,
                            childId[i],
                            input_path,
                            model_path,
                            settings_path,
                            pk_path,
                            srs_path,
                            "poseidon",
                            "accum",
                        ).set(task_id=temp_uuid)
                    )

                    # childTasks.append(ProofTask(
                    #     artifact=artifact_data,
                    #     taskId=temp_uuid,
                    #     status="PENDING",
                    #     proof=None,
                    #     instances=None,
                    #     transcriptType="poseidon",
                    #     strategy="single",
                    #     children=None
                    # ))

            # run the gen aggregate task once the childTasks are complete
            temp_uuid = celery_uuid()
            nb = {
                "artifactId": str(artifact.id),
                "logrows": logrows,
                "taskId": temp_uuid,
                "vk": os.path.join(ARTIFACT_PATH, artifact.vk),
                "pk": os.path.join(ARTIFACT_PATH, artifact.pk),
                "organizationId": organization.id,
            }
            callback = generate_aggregate_artifact.s(nb).set(task_id=temp_uuid)
            task = chord(header)(callback)

            return GenerateTask(artifact=artifact, taskId=task.id, status=task.status)


schema = strawberry.Schema(query=Query, mutation=Mutation)


blueprint.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql_view", schema=schema)
)


@blueprint.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "res": "Welcome to the ezkl hub's backend!"})


@blueprint.route("/install_ezkl_cli.sh", methods=["GET"])
def install_ezkl_cli():
    return blueprint.send_static_file("install_ezkl_cli.sh")
