# TRANSPILER
FROM node:16.2.0-alpine3.11 as base_transpile
WORKDIR /transpile
COPY packages/typeorm/package.json packages/typeorm/package.json
COPY package.json .
COPY yarn.lock .
COPY lerna.json .
COPY tsconfig.json .
RUN yarn install
COPY packages/typeorm packages/typeorm
COPY apps/api apps/api
COPY apps/bot apps/bot
COPY apps/web apps/web
RUN yarn global add lerna@3.22.1
RUN lerna exec yarn build --scope=@riddea/typeorm

# SERVICE
FROM node:16.2.0-alpine3.11 as base_service
ENV NODE_ENV production
WORKDIR /service
COPY package.json .
COPY yarn.lock .
COPY lerna.json .
RUN yarn global add lerna@3.22.1

# API
FROM base_transpile as transpile_api
COPY yarn.lock .
COPY apps/api apps/api
RUN yarn
RUN lerna exec yarn build --scope=@riddea/api

# BOT
FROM base_transpile as transpile_bot
COPY yarn.lock .
COPY apps/bot apps/bot
RUN yarn
RUN lerna exec yarn build --scope=@riddea/bot

# WEB
FROM base_transpile as transpile_web
COPY yarn.lock .
COPY apps/web apps/web
RUN yarn
RUN lerna exec yarn build --scope=@riddea/web

################
### SERVICES ###
################
FROM base_service as migrator
COPY apps/api/package.json apps/api/package.json
RUN yarn
COPY --from=base_transpile /transpile/packages/typeorm ./packages/typeorm
RUN lerna bootstrap
EXPOSE 3000
CMD [ "yarn", "migration:run"]

FROM base_service as api
COPY apps/api/package.json apps/api/package.json
RUN yarn
COPY --from=base_transpile /transpile/packages/typeorm ./packages/typeorm
COPY --from=transpile_api /transpile/apps/api/dist/src ./apps/api/dist
RUN lerna bootstrap
EXPOSE 3000
CMD [ "node", "apps/api/dist/main.js"]

FROM base_service as bot
COPY apps/bot/package.json apps/bot/package.json
RUN yarn
COPY --from=base_transpile /transpile/packages/typeorm ./packages/typeorm
COPY --from=transpile_bot /transpile/apps/bot/dist/src ./apps/bot/dist
RUN lerna bootstrap
EXPOSE 3001
CMD [ "node", "apps/bot/dist/app.js"]