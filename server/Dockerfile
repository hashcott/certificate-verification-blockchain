#################
## DEVELOPMENT ##
#################
FROM node:alpine AS development

WORKDIR /harrynguyen/server

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

################
## PRODUCTION ##
################
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /harrynguyen/server

COPY --from=development /harrynguyen/server .

EXPOSE 4001

CMD [ "node", "dist/main" ]