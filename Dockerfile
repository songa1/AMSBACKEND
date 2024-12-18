FROM node:20-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --legacy-peer-deps
COPY ./prisma ./prisma
RUN npx prisma generate
COPY . .

RUN npm run build

CMD [ "npm", "start" ]