FROM node:20-alpine

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=2048"

COPY package*.json ./

RUN yarn global add @nestjs/cli

RUN yarn install --prod 

COPY . .

RUN yarn build

EXPOSE 8001

CMD ["yarn", "start:prod"]
