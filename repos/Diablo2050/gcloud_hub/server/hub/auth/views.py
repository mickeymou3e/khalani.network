from flask import (
    Blueprint,
    url_for,
    redirect,
    make_response,
    request,
    session,
    render_template,
    jsonify,
    abort
)
from hub.extensions import oauth
from .models import (
    User,
    Organization,
    AccessToken,
    RefreshToken,
    Email,
    OAuth2Client
)
import requests
from cryptography.fernet import Fernet
import os
from datetime import datetime
import uuid
from authlib.jose import jwt
from authlib.oauth2 import OAuth2Error
from authlib.integrations.flask_oauth2 import current_token
from werkzeug.security import gen_salt
import time
import base64
import json
from urllib.parse import urlparse, parse_qs
from .utils import current_user,  split_by_crlf, external_url, secure_external_url


from .oauth import authorization, require_oauth

blueprint = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth",
    template_folder="templates",
    static_folder="static"
)



def generate_tokens(user_object):
    # generate cookie payload
    ezkl_access_token = str(uuid.uuid4())
    ezkl_refresh_token = str(uuid.uuid4())

    datetime_now = datetime.now()
    timestamp_now = round(datetime_now.timestamp())

    access_token_expires_in = 28800 # 8 hours
    access_token_expires_at = datetime.utcfromtimestamp(
        timestamp_now + access_token_expires_in)

    refresh_token_expires_in = 2628288 # 3 months
    refresh_token_expires_at = datetime.utcfromtimestamp(
        timestamp_now + refresh_token_expires_in)

    header = {'alg': 'HS256', 'typ': 'JWT'}
    access_token_payload = {
        "iss": "https://hub.ezkl.xyz",
        "sub": str(user_object.id),
        "iat": timestamp_now,
        "exp": access_token_expires_at.timestamp(),
        "aud": ezkl_access_token,
    }
    s_access = jwt.encode(
        header,
        access_token_payload,
        os.getenv("FERNET_SECRET")
    )

    refresh_token_payload = {
        "iss": "https://hub.ezkl.xyz",
        "sub": str(user_object.id),
        "iat": timestamp_now,
        "exp": refresh_token_expires_at.timestamp(),
        "aud": ezkl_refresh_token,
    }

    s_refresh = jwt.encode(
        header,
        refresh_token_payload,
        os.getenv("FERNET_SECRET")
    )

    # save access token in db
    cipher_suite = Fernet(os.getenv("FERNET_SECRET"))

    access_token = AccessToken(
        user_id=user_object.id,
        provider='ezkl',
        access_token_encrypted=cipher_suite.encrypt(ezkl_access_token.encode()),
        expires_at=access_token_expires_at
    )
    access_token.save()

    refresh_token = RefreshToken(
        user_id=user_object.id,
        provider='ezkl',
        refresh_token_encrypted=cipher_suite.encrypt(ezkl_refresh_token.encode()),
        expires_at=refresh_token_expires_at
    )
    refresh_token.save()

    return s_access, s_refresh, access_token_expires_at, refresh_token_expires_at





# OIDC OAuth Flow

@blueprint.route('/.well-known/jwks.json')
def well_known_jwks():
    """
    Extract the public key from
    https://russelldavies.github.io/jwk-creator/
    """
    return jsonify({
        "keys": [
            {
                "kty": os.getenv("JWKS_PUBLIC_KTY"),
                "n": os.getenv("JWKS_PUBLIC_N"),
                "e": os.getenv("JWKS_PUBLIC_E"),
                "alg": os.getenv("JWKS_PUBLIC_ALG"),
                "kid": os.getenv("JWKS_PUBLIC_KID"),
                "use": "sig"
            }
        ]
    })

@blueprint.route("/.well-known/openid-configuration")
def well_known_openid_configuration():
    if os.getenv("DEVELOPMENT") != "1":
        return jsonify({
            "issuer": 'https://hub.ezkl.xyz',
            "authorization_endpoint": secure_external_url('.authorize'),
            "token_endpoint": secure_external_url('.issue_token'),
            "userinfo_endpoint": secure_external_url('.userinfo'),
            "revocation_endpoint": secure_external_url('.revoke_token'),
            "jwks_uri": secure_external_url('.well_known_jwks'),
            "response_types_supported": [
                "code",
                "token"
                "id_token",
                "code token",
                "code id_token",
                "token id_token",
                "code token id_token",
                "none",
            ],
            "claims_supported": [
                "username",
                "email",
            ],
            "token_endpoint_auth_methods_supported": [
                "client_secret_post",
                "client_secret_basic"
            ],
            "id_token_signing_alg_values_supported": [
                "RS256",
            ],
            "subject_types_supported": ["public"],
            "ui_locales_supported": ["en-US"]
        })
    else:
        return jsonify({
            "issuer": 'https://hub.ezkl.xyz',
            "authorization_endpoint": external_url('.authorize'),
            "token_endpoint": external_url('.issue_token'),
            "userinfo_endpoint": external_url('.userinfo'),
            "revocation_endpoint": external_url('.revoke_token'),
            "jwks_uri": external_url('.well_known_jwks'),
            "response_types_supported": [
                "code",
                "token"
                "id_token",
                "code token",
                "code id_token",
                "token id_token",
                "code token id_token",
                "none",
            ],
            "claims_supported": [
                "username",
                "email",
            ],
            "token_endpoint_auth_methods_supported": [
                "client_secret_post",
                "client_secret_basic"
            ],
            "id_token_signing_alg_values_supported": [
                "RS256",
            ],
            "subject_types_supported": ["public"],
            "ui_locales_supported": ["en-US"]
        })



@blueprint.route('/', methods=('GET', 'POST'))
def auth_home():
    if request.method == 'POST':

        # prevent redirect hell with POST on insomnia
        user = current_user()
        if user:
            clients = OAuth2Client.query.filter_by(user_id=user.id).all()
            return render_template(
                'home.html',
                user=user,
                clients=clients,
                development=(os.getenv("DEVELOPMENT") == "1")
        )

        if os.getenv("DEVELOPMENT") == "1":
            username = request.form.get('username')
            user = User.query.filter_by(username=username).first()
            if not user:
                user = User(username=username)
                user.save()

                # create default org for user
                org = Organization(
                    id=user.id,
                    name = username,
                    default_organization = True,
                    default_organization_of_user = user.id
                )
                org.save()

            session['id'] = user.id
        next_page = request.args.get('next')
        if next_page:
            # store client redirect uri in session
            session['client_redirect_uri'] = next_page
            return redirect(next_page)
        else:
            return redirect(url_for('.auth_home'))
    user = current_user()
    if user:
        clients = OAuth2Client.query.filter_by(user_id=user.id).all()
    else:
        clients = []

    return render_template(
        'home.html',
        next=request.args.get('next'),
        user=user,
        clients=clients,
        development=(os.getenv("DEVELOPMENT") == "1")
    )


@blueprint.route('/logout')
def logout():
    del session['id']
    return redirect(url_for(".auth_home"))


@blueprint.route('/create_client', methods=('GET', 'POST'))
def create_client():
    user = current_user()
    if not user:
        return redirect(url_for('.auth_home'))
    if request.method == 'GET':
        return render_template('create_client.html')

    client_id = gen_salt(24)
    client_id_issued_at = int(time.time())
    client = OAuth2Client(
        client_id=client_id,
        client_id_issued_at=client_id_issued_at,
        user_id=user.id,
        client_secret = gen_salt(48)
    )

    form = request.form
    client_metadata = {
        "client_name": form["client_name"],
        "client_uri": form["client_uri"],
        "grant_types": split_by_crlf(form["grant_type"]),
        "redirect_uris": split_by_crlf(form["redirect_uri"]),
        "response_types": split_by_crlf(form["response_type"]),
        "scope": form["scope"],
        "token_endpoint_auth_method": form["token_endpoint_auth_method"]
    }
    client.set_client_metadata(client_metadata)

    client.client_secret = gen_salt(48)

    client.save()
    return redirect(url_for(".auth_home"))


@blueprint.route('/oidc/authorize', methods=['GET', 'POST'])
def authorize():
    user = current_user()
    # if user is not logged in redirect to home page to login
    if not user:
        return redirect(url_for('.auth_home', next=request.url))
    if request.method == 'GET':
        try:
            grant = authorization.get_consent_grant(end_user=user)
        except OAuth2Error as error:
            print(error)
            return error.error
        return render_template('authorize.html', user=user, grant=grant)
    # if not user and 'username' in request.form:
    #     username = request.form.get('username')
    #     user = User.query.filter_by(username=username).first()
    if request.form['confirm']:
        grant_user = user
    else:
        grant_user = None
    return authorization.create_authorization_response(grant_user=grant_user)


@blueprint.route('/oidc/token', methods=['POST'])
def issue_token():
    return authorization.create_token_response()


@blueprint.route('/oidc/revoke', methods=['POST'])
def revoke_token():
    return authorization.create_endpoint_response('revocation')


@blueprint.route('/oidc/userinfo')
@require_oauth('profile')
def userinfo():
    user = current_token.user
    return jsonify(id=user.id)


# Github Auth

@blueprint.route('/github/login')
def github_login():
    github = oauth.create_client('github')
    redirect_uri = url_for('auth.github_authorize', _external=True)
    csrf_token = os.urandom(24).hex()  # Generate a random token
    session['csrf_token'] = csrf_token
    state_data = {
        'csrf_token': csrf_token,  # Generate a new token for each request.
        'next_url': request.args.get('next')
    }

    state_encoded = base64.urlsafe_b64encode(json.dumps(state_data).encode()).decode()
    #print(redirect_uri)
    return github.authorize_redirect(redirect_uri, state=state_encoded)


@blueprint.route('/github/authorize')
def github_authorize():
    github = oauth.create_client('github')
    token = github.authorize_access_token()
    resp = github.get('user', token=token)
    profile = resp.json()

    # print(profile['login'])
    # print(profile['avatar_url'])

    # print(token)

    # try getting user, otherwise create a user
    user = User.query.filter_by(github_id=profile['id']).first()
    if not user:
        user = User(
            username=profile['login'],
            github_id=profile['id'],
            github_node_id=profile['node_id'],
            avatar_url=profile['avatar_url']
        )
        user.save()
    else:
        # update details with github
        user.username=profile['login']
        user.github_id=profile['id']
        user.github_node_id=profile['node_id']
        user.avatar_url=profile['avatar_url']

    # try getting the default organization for the user
    # otherwise create the organization with the user's username
    org = Organization.query.filter_by(default_organization_of_user=user.id).first()

    if not org:
        org = Organization(
            id=user.id,
            name = profile['login'],
            default_organization = True,
            default_organization_of_user = user.id
        )
        org.save()
    else:
        # update name if the user has changed their username on github
        org.name = profile['login']
        org.save()


    # store the oauth token
    cipher_suite = Fernet(os.getenv("FERNET_SECRET"))
    expires_at_datetime = datetime.utcfromtimestamp(token['expires_at'])
    access_token = AccessToken(
        user_id=user.id,
        provider='github',
        access_token_encrypted=cipher_suite.encrypt(token['access_token'].encode()),
        # refresh_token_encrypted=cipher_suite.encrypt(token['refresh_token'].encode()),
        expires_at=expires_at_datetime
    )
    access_token.save()

    refresh_token_expires_at_datetime = datetime.utcfromtimestamp(
        round(datetime.now().timestamp()) + token['refresh_token_expires_in'])
    refresh_token = RefreshToken(
        user_id=user.id,
        provider='github',
        refresh_token_encrypted=cipher_suite.encrypt(token['refresh_token'].encode()),
        expires_at=refresh_token_expires_at_datetime
    )
    refresh_token.save()

    # fetch and store github email
    emails = requests.get(
        url="https://api.github.com/user/emails",
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Authorization": f"Bearer {token['access_token']}"
        }
    )
    emails_data = emails.json()

    for email_dict in emails_data:
        # check if email linked to user id exists first
        # if exist do not save the email to the user id again
        existing_email = Email.query.filter_by(
            email=email_dict['email'], user_id=user.id).first()

        # else save
        if not existing_email:
            email_instance = Email(
                email=email_dict['email'],
                primary=email_dict["primary"],
                verified=email_dict["verified"],
                user_id=user.id
            )
            email_instance.save()


    # to consider removing this custom access and refresh token flow
    # access_token, refresh_token, a_expiry, r_expiry = generate_tokens(user)

    # get grant user
    # response = authorization.create_authorization_response(grant_user=user)

    # print(response)
    # print(response.data)

    # set session id
    session['id'] = user.id

    state_data = request.args.get('state')
    state_data = json.loads(base64.urlsafe_b64decode(state_data.encode()).decode())

    print(state_data)
    stored_csrf_token = session.get('csrf_token')

    if state_data['csrf_token'] != stored_csrf_token:
        abort(400, "Invalid CSRF Token")
    else:
        # clear the csrf token as we have used it
        del session['csrf_token']

    if state_data['next_url'] is not None:
        # find the redirect url
        parsed_url = urlparse(state_data['next_url'])
        query_params = parse_qs(parsed_url.query)
        redirect_uri = query_params.get('redirect_uri', [None])[0]

        # response = make_response(redirect(redirect_uri))

        response = make_response(redirect(url_for(".auth_home", next=redirect_uri)))

    else:
        # redirect to the dashboard
        response = make_response(redirect(url_for(".auth_home")))
        # response.set_cookie(
        #     'access_token',
        #     access_token,
        #     httponly=True,
        #     samesite='Lax',
        #     domain='127.0.0.1',
        #     expires=a_expiry
        # )
        # response.set_cookie(
        #     'refresh_token',
        #     refresh_token,
        #     httponly=True,
        #     samesite='Lax',
        #     domain='127.0.0.1',
        #     expires=r_expiry
        # )


    # if int(os.getenv("DEVELOPMENT", 0)) == 1:
        # redirect to frontend
        # response = make_response(redirect(client_redirect_uri))
        # response.set_cookie(
        #     'access_token',
        #     access_token,
        #     httponly=True,
        #     samesite='Lax',
        #     domain='127.0.0.1',
        #     expires=a_expiry
        # )
        # response.set_cookie(
        #     'refresh_token',
        #     refresh_token,
        #     httponly=True,
        #     samesite='Lax',
        #     domain='127.0.0.1',
        #     expires=r_expiry
        # )
    # else:
        # response = make_response(redirect(client_redirect_uri))
        # response.set_cookie(
        #     'access_token',
        #     access_token,
        #     httponly=True,
        #     samesite='Lax',
        #     domain='.ezkl.xyz',
        #     expires=a_expiry
        # )
        # response.set_cookie(
        #     'refresh_token',
        #     refresh_token,
        #     httponly=True,
        #     samesite='Lax',
        #     domain='.ezkl.xyz',
        #     expires=r_expiry
        # )

    return response
