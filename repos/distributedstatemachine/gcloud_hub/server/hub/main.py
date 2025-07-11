from flask import Flask
from hub.extensions import db, migrate, cors, oauth
from hub import graphql, auth
import logging
import sys
import os
import secrets
from celery import Celery


def create_app():
    """Create application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/."""

    app = Flask("hub")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI", "postgresql+psycopg2://postgres:postgres@localhost:5432/hub")
    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY", secrets.token_hex(64))
    register_extensions(app)
    register_blueprints(app)
    configure_logger(app)
    return app


def register_extensions(app):
    """Register Flask extensions"""
    cors.init_app(app)
    oauth.init_app(app)

    github = oauth.register(
        name='github',
        client_id=os.getenv("GITHUB_CLIENT_ID"),
        client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
        access_token_url='https://github.com/login/oauth/access_token',
        access_token_params=None,
        authorize_url='https://github.com/login/oauth/authorize',
        authorize_params=None,
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'},
    )

    auth.oauth.init_app(app)
    db.init_app(app)
    # TODO: CSRF_Protect does not work with the graphiql as it will inject into
    # the graphql field causing it to not be read properly.
    # To look into whether this is really needed
    # csrf_protect.init_app(app)
    migrate.init_app(app, db)
    return None


def register_blueprints(app):
    """Register Flask blueprints"""
    app.register_blueprint(graphql.views.blueprint)
    app.register_blueprint(auth.views.blueprint)


def configure_logger(app):
    """Configure loggers."""
    handler = logging.StreamHandler(sys.stdout)
    if not app.logger.handlers:
        app.logger.addHandler(handler)

