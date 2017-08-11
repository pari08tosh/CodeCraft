# Base image
FROM ubuntu:16.04

#FOR DEBUGGING  
RUN apt-get update -y
RUN apt-get upgrade -y

# Installing node and npm.
RUN apt-get install nodejs -y && apt-get install nodejs-legacy -y && apt-get install npm -y


# Installing launguages
RUN apt-get install build-essential && apt-get install python3 -y
RUN apt-get update -y && apt-get install openjdk-8-jdk -y

# Define working directory
WORKDIR /usr/src/app

COPY package.json .


# Install Dependencies
RUN npm install


# Copy app files into WORKDIR
COPY . .


# Expose port 8080
EXPOSE 8080

# Run app using npm
CMD ["npm", "start"]
