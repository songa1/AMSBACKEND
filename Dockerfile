FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --legacy-peer-deps
COPY ./prisma ./prisma
RUN npx prisma generate
COPY . .

RUN npm run build

CMD [ "npm", "start" ]