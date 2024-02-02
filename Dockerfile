FROM node:21.5.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npm run build-server

EXPOSE 3000

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
ENTRYPOINT ["node", "dist/server/server.js"]
=======
ENTRYPOINT ["node", "dist/server/server.js"]
>>>>>>> Amunoz-1-feature/DOM_revamp
=======
ENTRYPOINT ["node", "dist/server/server.js"]
>>>>>>> 4882b16 (Rename dockerfile to Dockerfile)
=======
ENTRYPOINT ["node", "dist/server/server.js"]
>>>>>>> b39eebc (docker)
