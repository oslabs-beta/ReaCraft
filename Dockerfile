FROM node:21.5.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm run build-server

EXPOSE 3000

<<<<<<< HEAD
ENTRYPOINT ["node", "dist/server/server.js"]
=======
ENTRYPOINT ["node", "dist/server/server.js"]
>>>>>>> Amunoz-1-feature/DOM_revamp
