FROM node:14-alpine

WORKDIR /usr/src/kakao-auth-app

COPY package*.json ./

RUN npm install -g nodemon ts-node typescript
RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]