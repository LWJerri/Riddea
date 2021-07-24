# TRANSPILER
FROM node:16.5.0-alpine3.11 as transpile
RUN apk add --no-cache git
WORKDIR /transpile
COPY package.json yarn.lock lerna.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/bot/package.json apps/bot/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/typeorm/package.json packages/typeorm/package.json
RUN yarn --pure-lockfile
COPY packages/ packages/
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
FROM base_service as migrator
ENV NODE_ENV="production"
COPY --from=transpile /transpile/packages/typeorm ./packages/typeorm
COPY --from=transpile /transpile/package.json ./
COPY --from=transpile /transpile/node_modules ./node_modules
CMD [ "typeorm", "migration:run"]

FROM base_service as api
COPY --from=transpile /transpile/packages/typeorm packages/typeorm
COPY --from=transpile /transpile/apps/api apps/api
ENV NODE_ENV="production"
EXPOSE 3000
CMD [ "node", "./apps/api/dist/src/main.js"]

FROM base_service as bot
COPY --from=transpile /transpile/apps/bot apps/bot
COPY --from=transpile /transpile/packages/typeorm packages/typeorm
ENV NODE_ENV="production"
EXPOSE 3001
CMD [ "node", "./apps/bot/dist/src/main.js"]

FROM nginx:stable-alpine as web
COPY --from=transpile /transpile/apps/web/dist ./usr/share/nginx/html
COPY --from=transpile /transpile/apps/web/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
