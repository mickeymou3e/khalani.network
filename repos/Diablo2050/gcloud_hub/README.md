# EzklHub Backend

## Development Instructions
1. Install Docker
2. Setup the postgres database and redis database by running `./dev-build`.
3. Start the postgres database and redis database by running `./dev-run`.
4. If needed stop the postgres database and redis database by running `./dev-stop`. Thought it
5. Download SRS by running `./download_srs`.
6. The python server is setup using poetry. Install poetry.
7. If your python version is not 3.11 you may want to install pyenv and set the python environment to 3.11.
8. Navigate to the server folder by running `cd server`.
9. When the environment is set up, install dependencies by running `poetry install`.
10. Activate the virtual environment of the project by running `poetry shell`.
11. You will now need to install the ezkl wheels separately with pip, this is to allow us to use multiple ezkl versions. Run `./get_ezkl.sh`
12. Apply the migrations to the local database by running `flask db upgrade`.
13. You should have access to `flask` upon which you can run `flask run` to start the server.
14. To start the celery worker run `celery --app app.celery worker --loglevel info`.
15. To test, run `pytest`. **IMPORTANT NOTE: As pytest will delete artifacts and database entries, do not run pytest in production**

## Database Migrations
1. Create a new migration `flask db migrate -m "My new migration."`.
2. Apply the migrations on the connected db `flask db upgrade`.
3. For more help regarding migrations run `flask db --help`.

## Production Notes
1. To access a container's shell within the server you can run
```
sudo docker exec -it <container name> /bin/sh

# to get the container name
sudo docker ps

CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS                                      NAMES
3bee03059f73   server    "poetry run gunicorn…"   About a minute ago   Up About a minute   0.0.0.0:5000->5000/tcp                     server-prod
```

2. After accessing the container's shell you can run commands like in the case of `server-prod`
```
# to upgrade the production database with the latest db migration script
flask db upgrade

# to run a python shell in the application context
flask shell
```

## Kubernetes Notes
1. You will need to install `kubectl`, `gcloud-cli`
1. Authorize helm.
```
gcloud auth print-access-token | helm registry login -u oauth2accesstoken \
--password-stdin https://us-central1-docker.pkg.dev
```

2. Package the kubernetes chart
```
helm package hub-kube/
```

3. Push the chart. Replace the version
```
helm push hub-kube-0.1.0.tgz oci://us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub
```

4. Verify if the chart is stored in the repository
```
gcloud artifacts docker images list us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub
```

5. Deploy the chart, you will need to have created the cluster already
```
# check if you have clusters running
gcloud container clusters list

# otherwise create
gcloud container clusters create --zone us-central1-a your-cluster-name
```

6. Get cluster credentials, for kubectl
```
gcloud container clusters get-credentials --zone us-central1 ezkl-hub-cluster
```

7. Install the chart using the uploaded files
```
helm install hub-kube oci://us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub/hub-kube --version 0.1.0
```
