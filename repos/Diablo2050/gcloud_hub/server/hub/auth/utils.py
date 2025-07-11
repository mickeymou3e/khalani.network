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
from .models import User

def current_user():
    if 'id' in session:
        uid = session['id']
        return User.query.get(uid)
    return None


def split_by_crlf(s):
    return [v for v in s.splitlines() if v]


def external_url(function_name):
    return url_for(function_name, _external=True)


def secure_external_url(function_name):
    url = external_url(function_name)
    return url.replace("http://", "https://", 1)