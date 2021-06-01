FROM node:16.2.0-alpine3.11

RUN apk add --no-cache bash

COPY . /app
WORKDIR /app

RUN yarn
RUN yarn build

EXPOSE 3000
EXPOSE 3001
