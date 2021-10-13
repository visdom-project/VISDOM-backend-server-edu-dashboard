FROM node:14.18.1-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm clean-install
COPY . .
EXPOSE 8000

CMD [ "node", "index.js" ]
