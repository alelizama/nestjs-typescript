FROM node:14.16.0 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start
