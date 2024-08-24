FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --legacy-peer-deps
COPY ./src/_prisma ./src/_prisma
RUN npx prisma generate --schema ./src/_prisma/schema.prisma
COPY . .

RUN npm run build

CMD [ "npm", "start" ]