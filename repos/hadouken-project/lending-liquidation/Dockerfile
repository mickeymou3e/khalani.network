FROM node:16.17.1-buster
ARG bundle=api.zip

ADD ${bundle} /tmp
RUN mkdir -p /app
WORKDIR /app
ADD docker/entrypoint.sh /
RUN unzip -q /tmp/${bundle} && rm /tmp/${bundle}
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT [ "/entrypoint.sh" ]