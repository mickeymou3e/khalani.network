from authlib.oidc.core import grants as oidcgrants, UserInfo
from authlib.oauth2.rfc6749 import grants as rfcgrants
from authlib.oauth2.rfc7636 import CodeChallenge
from authlib.integrations.flask_oauth2 import (
    AuthorizationServer,
    ResourceProtector,
)
from authlib.integrations.sqla_oauth2 import (
    create_query_client_func,
    create_save_token_func,
    create_revocation_endpoint,
    create_bearer_token_validator,
)
from authlib.jose import RSAKey
from flask import request, render_template
from .models import (
    User,
    OAuth2AuthorizationCode,
    RefreshToken,
    OAuth2Client,
    OAuth2Token
)
from cryptography.fernet import Fernet
import os
from hub.database import session
from werkzeug.security import gen_salt
import base64

# Helper Functions and Variables

JWT_CONFIG = {
    'key': RSAKey.import_key(
        base64.b64decode(os.getenv("OIDC_PRIVATE_KEY")).decode('utf-8')),
    'alg': 'RS256',
    'iss': 'https://hub.ezkl.xyz',
    'exp': 28800
}

def save_authorization_code(code, request):
    nonce = request.data.get('nonce')
    item = OAuth2AuthorizationCode(
        code=code,
        client_id=request.client.client_id,
        redirect_uri=request.redirect_uri,
        scope=request.scope,
        user_id=request.user.id,
        nonce=nonce,
    )
    item.save()
    return code


def exists_nonce(nonce, req):
    exists = OAuth2AuthorizationCode.query.filter_by(
        client_id=req.client_id, nonce=nonce
    ).first()
    return bool(exists)


def generate_user_info(user, scope):
    return UserInfo(sub=str(user.id), name=user.username)


def create_authorization_code(client, grant_user, request):
    code = gen_salt(48)


def query_client(client_id):
    return OAuth2Client.query.filter_by(client_id=client_id).first()


def save_token(token_data, request):
    if request.user:
        user_id = request.user.get_user_id()
    else:
        # client_credentials grant_type
        user_id = request.client.user_id
        # or, depending on how you treat client_credentials
        user_id = None
    token = OAuth2Token(
        client_id=request.client.client_id,
        user_id=user_id,
        **token_data
    )
    token.save()


# Grants


class AuthorizationCodeGrant(rfcgrants.AuthorizationCodeGrant):
    TOKEN_ENDPOINT_AUTH_METHODS = [
        'client_secret_basic',
        'client_secret_post',
        'none',
    ]

    def save_authorization_code(self, code, request):
        return save_authorization_code(code, request)

    def query_authorization_code(self, code, client):
        item = OAuth2AuthorizationCode.query.filter_by(
            code=code, client_id=client.client_id).first()
        if item and not item.is_expired():
            return item

    def delete_authorization_code(self, authorization_code):
        authorization_code.delete()

    def authenticate_user(self, authorization_code):
        return User.query.get(authorization_code.user_id)


class RefreshTokenGrant(rfcgrants.RefreshTokenGrant):
    def authenticate_refresh_token(self, refresh_token):
        # encrypt refresh token
        cipher_suite = Fernet(os.getenv("FERNET_SECRET"))
        encrypted_refresh_token = cipher_suite.encrypt(refresh_token.encode())


        item = RefreshToken.query.filter_by(refresh_token=encrypted_refresh_token).first()
        # define is_refresh_token_valid by yourself
        # usually, you should check if refresh token is expired and revoked
        if item and item.is_refresh_token_valid():
            return item

    def authenticate_user(self, credential):
        return User.query.get(credential.user_id)

    def revoke_old_credential(self, credential):
        credential.revoked = True
        credential.save()



class OpenIDCode(oidcgrants.OpenIDCode):
    def exists_nonce(self, nonce, request):
        return exists_nonce(nonce, request)

    def get_jwt_config(self, grant):
        return JWT_CONFIG

    def generate_user_info(self, user, scope):
        return generate_user_info(user, scope)



class OpenIDImplicitGrant(oidcgrants.OpenIDImplicitGrant):
    def exists_nonce(self, nonce, request):
        return exists_nonce(nonce, request)

    def get_jwt_config(self, grant):
        return JWT_CONFIG

    def generate_user_info(self, user, scope):
        return generate_user_info(user, scope)


class OpenIDHybridGrant(oidcgrants.OpenIDHybridGrant):
    def save_authorization_code(self, code, request):
        return save_authorization_code(code, request)

    def exists_nonce(self, nonce, request):
        return exists_nonce(nonce, request)

    def get_jwt_config(self):
        return JWT_CONFIG

    def generate_user_info(self, user, scope):
        return generate_user_info(user, scope)



authorization = AuthorizationServer()
require_oauth = ResourceProtector()


def init_app(app):
    query_client = create_query_client_func(session, OAuth2Client)
    save_token = create_save_token_func(session, OAuth2Token)

    authorization.init_app(
        app,
        query_client=query_client,
        save_token=save_token
    )

    # support all grants
    authorization.register_grant(
        AuthorizationCodeGrant,
        [
            OpenIDCode(require_nonce=True),
            # TODO add code challenge to increase security
            # CodeChallenge(required=True)
        ]
    )
    authorization.register_grant(OpenIDImplicitGrant)
    authorization.register_grant(OpenIDHybridGrant)
    authorization.register_grant(rfcgrants.ClientCredentialsGrant)
    authorization.register_grant(RefreshTokenGrant)

    # support revocation
    revocation_cls = create_revocation_endpoint(session, OAuth2Token)
    authorization.register_endpoint(revocation_cls)

    # protect resource
    bearer_cls = create_bearer_token_validator(session, OAuth2Token)
    require_oauth.register_token_validator(bearer_cls())

# TODO Create Error URIs