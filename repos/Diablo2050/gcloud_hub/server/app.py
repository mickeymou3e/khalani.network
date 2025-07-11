from hub.main import create_app
from hub.celeryapp import celery

app = create_app()

celery = celery

if __name__ == "__main__":
    app.run()