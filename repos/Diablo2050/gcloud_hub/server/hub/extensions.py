from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth


db = SQLAlchemy()
migrate = Migrate()
csrf_protect = CSRFProtect()
cors = CORS()
oauth = OAuth()