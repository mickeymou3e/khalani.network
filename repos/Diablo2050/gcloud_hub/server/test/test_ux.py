import os
import pytest
import base64
from unittest.mock import patch
from hub.main import create_app
from hub.extensions import db
from hub.graphql.models import Artifact, SolidityArtifact
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend

from hub.auth.models import (
    User,
    Organization,
    Role,
    UserRoleAssociation,
    Email,
    AccessToken,
    RefreshToken,
    OAuth2Client,
    OAuth2Token,
    OAuth2AuthorizationCode,
)
import shutil
import json
from flask import url_for, session

TEST_DIR = os.path.dirname(os.path.realpath(__file__))
ARTIFACT_DIR = os.path.abspath(TEST_DIR + "/../artifact")
DO_NOT_DELETE = ["srs", ".gitkeep"]

# MOCK_OIDC = "FOO"
# bytes_oidc = MOCK_OIDC.encode("utf-8")
# base64_bytes = base64.b64encode(bytes_oidc)
# base64_s = base64_bytes.decode("utf-8")


# @pytest.fixture(autouse=True)
# def mock_oidc_private_key():
#     # Generate a new private key
#     private_key = rsa.generate_private_key(
#         public_exponent=65537, key_size=2048, backend=default_backend()
#     )

#     # Serialize the private key to the PEM format
#     pem = private_key.private_bytes(
#         encoding=serialization.Encoding.PEM,
#         format=serialization.PrivateFormat.PKCS8,
#         encryption_algorithm=serialization.NoEncryption(),
#     )

#     # Convert the PEM bytes to a string
#     pem_str = pem.decode("utf-8")

#     # Convert the string to bytes, because base64 works on bytes
#     bytes_s = pem_str.encode("utf-8")

#     # Encode the bytes in base64
#     base64_bytes = base64.b64encode(bytes_s)

#     # Convert the base64 bytes back to a string
#     base64_s = base64_bytes.decode("utf-8")

#     with patch.dict("os.environ", {"OIDC_PRIVATE_KEY": base64_s}):
#         yield


@pytest.fixture()
def app():
    app = create_app()

    if os.getenv("DEVELOPMENT") != "1":
        raise Exception("Not Development Environment")

    app.testing = True

    # reset dev db
    with app.app_context():
        db.session.remove()
        db.session.query(SolidityArtifact).delete()
        db.session.query(UserRoleAssociation).delete()
        db.session.query(AccessToken).delete()
        db.session.query(RefreshToken).delete()
        db.session.query(OAuth2Client).delete()
        db.session.query(OAuth2Token).delete()
        db.session.query(OAuth2AuthorizationCode).delete()
        db.session.query(Email).delete()
        db.session.query(Artifact).delete()
        db.session.query(Organization).delete()
        db.session.query(User).delete()
        db.session.query(Role).delete()
        db.session.commit()

    # delete dev artifacts
    for item in os.listdir(ARTIFACT_DIR):
        if item not in DO_NOT_DELETE:
            try:
                os.remove(os.path.join(ARTIFACT_DIR, item))
            except PermissionError:
                shutil.rmtree(os.path.join(ARTIFACT_DIR, item))

    yield app


@pytest.fixture()
def client(app):
    client = app.test_client()

    # setup a test acc
    client.post("/auth", data={"username": "test1"}, follow_redirects=True)

    return client


def test_healthcheck(client):
    """Test if the server works at all"""

    response = client.get("/")
    assert response.status_code == 200
    assert response.json == {
        "status": "ok",
        "res": "Welcome to the ezkl hub's backend!",
    }


def test_graphql(client):
    """Test if the server works at all"""

    response = client.get("/graphql?query={__schema{types{name}}}")
    # returns a 400
    assert response.status_code == 200


def test_login_and_session(client, app):
    """Test login functionality and session token"""

    response = client.post("/auth", data={"username": "test2"}, follow_redirects=True)

    assert response.status_code == 200

    with app.app_context():
        user = User.query.filter_by(username="test2").first()
        assert user is not None

        org = Organization.query.filter_by(name="test2").first()
        assert org is not None

    with client.session_transaction() as session:
        assert session["id"] == user.id


def test_upload_artifact_no_login(client):
    """Test uploading an artifact via graphql without login, this should fail"""

    with client.session_transaction() as session:
        if "id" in session:
            del session["id"]

    upload_artifact_operation = json.dumps(
        {
            "query": 'mutation($model: Upload!, $settings: Upload!, $pk: Upload!) { uploadArtifactLegacy( name: "test" \n description: "test" \n srs: perpetual_powers_of_tau_17 \n model: $model \n settings: $settings \n pk: $pk ) { \n id \n } }',
            "variables": {"model": None, "settings": None, "pk": None},
        }
    )

    upload_artifact_map = json.dumps(
        {
            "model": ["variables.model"],
            "settings": ["variables.settings"],
            "pk": ["variables.pk"],
        }
    )

    response = client.post(
        "/graphql",
        data={
            "operations": upload_artifact_operation,
            "map": upload_artifact_map,
            "model": (os.path.join(TEST_DIR, "1.11.5", "network_single.ezkl"), "rb"),
            "settings": (
                os.path.join(TEST_DIR, "1.11.5", "settings_single.json"),
                "rb",
            ),
            "pk": (os.path.join(TEST_DIR, "1.11.5", "pk_single.key"), "rb"),
        },
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["data"] is None
    assert (
        data["errors"][0]["message"] == "Please login before uploading your artifacts"
    )


def test_upload_artifact_login_default_org(client):
    """Test uploading an artifact via graphql"""

    upload_artifact_operation = json.dumps(
        {
            "query": 'mutation($model: Upload!, $settings: Upload!, $pk: Upload!) { uploadArtifactLegacy( name: "test" \n description: "test" \n srs: perpetual_powers_of_tau_17 \n model: $model \n settings: $settings \n pk: $pk ) { \n id \n } }',
            "variables": {"model": None, "settings": None, "pk": None},
        }
    )

    upload_artifact_map = json.dumps(
        {
            "model": ["variables.model"],
            "settings": ["variables.settings"],
            "pk": ["variables.pk"],
        }
    )

    response = client.post(
        "/graphql",
        data={
            "operations": upload_artifact_operation,
            "map": upload_artifact_map,
            "model": (os.path.join(TEST_DIR, "1.11.5", "network_single.ezkl"), "rb"),
            "settings": (
                os.path.join(TEST_DIR, "1.11.5", "settings_single.json"),
                "rb",
            ),
            "pk": (os.path.join(TEST_DIR, "1.11.5", "pk_single.key"), "rb"),
        },
    )

    assert response.status_code == 200
    data = response.get_json()
    # get id
    artifact_id = data["data"]["uploadArtifactLegacy"]["id"]

    # query artifact id
    payload = {
        "query": """
            query($id: String!) {
                artifact(id: $id) {
                    id
                    name
                    description
                    srs
                    pk
                    pkUploaded
                    pkValidated
                    vk
                    vkUploaded
                    vkValidated
                    uncompiledModel
                    uncompiledModelUploaded
                    uncompiledModelValidated
                    model
                    modelUploaded
                    modelValidated
                    settings
                    settingsUploaded
                    settingsValidated

                    parent {
                        id
                    }
                    children {
                        id
                    }
                    solidityArtifacts {
                        solidityCode
                    }
                }
            }
        """,
        "variables": {"id": f"{artifact_id}"},
    }

    response = client.post(
        "/graphql", data=json.dumps(payload), content_type="application/json"
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data == {
        "data": {
            "artifact": {
                "id": artifact_id,
                "name": "test",
                "description": "test",
                "srs": "perpetual_powers_of_tau_17",
                "pk": f"{artifact_id}/pk.key",
                "pkUploaded": True,
                "pkValidated": False,
                "vk": f"{artifact_id}/vk.key",
                "vkUploaded": False,
                "vkValidated": False,
                "uncompiledModel": None,
                "uncompiledModelUploaded": False,
                "uncompiledModelValidated": False,
                "model": f"{artifact_id}/network.ezkl",
                "modelUploaded": True,
                "modelValidated": False,
                "settings": f"{artifact_id}/settings.json",
                "settingsUploaded": True,
                "settingsValidated": False,
                "parent": None,
                "children": [],
                "solidityArtifacts": [],
            }
        }
    }
