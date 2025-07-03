FROM node:16-buster
ARG bundle=api.zip

ADD ${bundle} /tmp
RUN mkdir -p /app
WORKDIR /app
ADD docker/entrypoint.sh /
RUN unzip -q /tmp/${bundle} && rm /tmp/${bundle}
RUN ["chmod", "+x", "/entrypoint.sh"]

COPY docker/patches/node_modules/@nomicfoundation/ethereumjs-block/dist/header.js /app/node_modules/@nomicfoundation/ethereumjs-block/dist/
COPY docker/patches/node_modules/@nomicfoundation/ethereumjs-common/dist/common.js /app/node_modules/@nomicfoundation/ethereumjs-common/dist/
COPY docker/patches/node_modules/@nomicfoundation/ethereumjs-tx/dist/legacyTransaction.js /app/node_modules/@nomicfoundation/ethereumjs-tx/dist/
COPY docker/patches/node_modules/@nomicfoundation/ethereumjs-vm/dist/runTx.js /app/node_modules/@nomicfoundation/ethereumjs-vm/dist/

ENTRYPOINT [ "/entrypoint.sh" ]
