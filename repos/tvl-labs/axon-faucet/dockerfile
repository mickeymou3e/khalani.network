FROM node:16
ADD . .
RUN yarn install
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
