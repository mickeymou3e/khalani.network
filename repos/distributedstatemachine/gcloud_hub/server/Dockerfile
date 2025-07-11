FROM --platform=linux/amd64 python:3.11-slim

RUN apt-get update && apt-get install -y wget

# environment setup
# ARG celeryBrokerUrl="redis://:redis@localhost:6379/0"
# ENV CELERY_BROKER_URL $celeryBrokerUrl

# ARG celeryResultBackend="redis://:redis@localhost:6379/0"
# ENV CELERY_RESULT_BACKEND $celeryResultBackend

# ARG sqlalchemyDatabaseUri="postgresql+psycopg2://postgres:postgres@localhost:5432/hub"
# ENV SQLALCHEMY_DATABASE_URI $sqlalchemyDatabaseUri

# ARG secretKey="39bb6dc3da3f17dd7e17c9904f0de83bcb75e7f8f17c6cddbe0992fbbeb11f10810cdb80068fba9209fba81ca45254b11003233556fba33c24b2a837294e8837"
# ENV SECRET_KEY $secretKey

WORKDIR /server

ENV PYTHONPATH=${PYTHONPATH}:${PWD}

# install poetry and wheel
RUN pip3 install poetry wheel
RUN poetry config virtualenvs.create false

# install poetry dependencies
COPY poetry.lock pyproject.toml /server/
# RUN poetry install --without dev
RUN poetry install 

# get ezkl wheels
COPY ezkl_wheels /server/ezkl_wheels
COPY get_ezkl.sh /server/
COPY download_srs_cluster.sh /server/
RUN bash get_ezkl.sh
# RUN bash download_srs_cluster.sh

# get solc-select and default to 0.8.20
RUN pip3 install solc-select
RUN pip3 install pytest
RUN solc-select install 0.8.20
RUN solc-select use 0.8.20

# Copy remaining files
COPY app.py /server/
COPY solc /server/
COPY hub /server/hub
COPY migrations /server/migrations

ENTRYPOINT ["poetry"]
