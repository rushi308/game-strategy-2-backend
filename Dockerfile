# Base image to use
FROM node:12.22-alpine

# set a working directory
WORKDIR /src

# Copy across project configuration information
# Install application dependencies
COPY package*.json /src/
RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
# Ask npm to install the dependencies
RUN npm install -g supervisor && npm install && npm install supervisor

# Copy across all our files
COPY . /src

# Expose our application port (3000)
EXPOSE 3000

# Run no-demon so files can be updated
