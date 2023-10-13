FROM node:18 

WORKDIR /usr/src/app

# copy the application sources
COPY . .
RUN rm -rf node_modules; npm install
# buid the front-end application
RUN npm run build

EXPOSE 3001
CMD ["node", "server/server.js"]
