# Fetching the minified node image on apline linux
# FROM node:20.12.2
FROM node:slim

# Setting up the work directory
WORKDIR /CampusCart-Backend

# Copying all the files in our project
COPY . .

COPY .env .env

# Installing dependencies
RUN npm install
# RUN apt-get install timelimit
# Starting our application
CMD [ "node", "app.js" ]

# Exposing server port
EXPOSE 5000