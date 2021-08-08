# TRANSPILER
FROM node:16.5.0-alpine3.11 as transpile
RUN apk add --no-cache git
WORKDIR /transpile
COPY package.json yarn.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/web/package.json apps/web/package.json
RUN yarn --pure-lockfile
COPY apps/ apps/
RUN yarn build

# SERVICE
FROM node:16.5.0-alpine3.11 as base_service
RUN apk add --no-cache git
ENV NODE_ENV production
WORKDIR /service
COPY locales/ locales/

################
### SERVICES ###
################
FROM base_service as backend
COPY --from=transpile /transpile/apps/backend apps/backend
ENV NODE_ENV="production"
EXPOSE 3000
WORKDIR apps/backend
CMD [ "yarn", "start"]

FROM nginx:stable-alpine as web
COPY --from=transpile /transpile/apps/web/dist ./usr/share/nginx/html
COPY --from=transpile /transpile/apps/web/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
