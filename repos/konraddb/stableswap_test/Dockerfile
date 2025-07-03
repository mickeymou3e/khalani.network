FROM node:16

WORKDIR /usr/src/app

COPY src/libs/mock-data/ ./src/libs/mock-data/

RUN yarn init --yes
RUN yarn add json-server

EXPOSE 80

CMD yarn json-server --host 0.0.0.0 --port 80 src/libs/mock-data/lock.json