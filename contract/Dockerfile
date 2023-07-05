#################
## DEVELOPMENT ##
#################
FROM node:16 AS development

WORKDIR /harrynguyen/contract

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN npm install -g truffle

RUN pnpm install

COPY . .

CMD [ "pnpm", "start",'--network' , 'sepolia']

################
## PRODUCTION ##
################
FROM node:16 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /harrynguyen/contract

COPY --from=development /harrynguyen/contract .

RUN pnpm start --network sepolia
