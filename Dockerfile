FROM node:alpine

RUN apk update && mkdir /projects
ADD . ./projects
EXPOSE 8080
WORKDIR /projects
RUN npm install
CMD ["node", "app.js"]
