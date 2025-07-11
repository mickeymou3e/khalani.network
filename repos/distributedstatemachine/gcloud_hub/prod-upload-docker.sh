# Ensure that you have already run the required auth settings

# First
# set up gcp auth for docker
gcloud auth configure-docker \
    us-central1-docker.pkg.dev

# we use the hosted db on the kubernetes setup
# docker build -t db ./db;
# docker build -t redis ./redis;
# docker build -t nginx --no-cache ./nginx;
docker build -t server ./server;

# tag the images with the repository name
# docker tag redis us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub/redis;
# docker tag nginx us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub/nginx;
docker tag server us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub/server;

# push to the registry
# docker push us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub/redis;
# docker push us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub/nginx;
docker push us-central1-docker.pkg.dev/civil-lambda-374300/ezkl-hub/server;
