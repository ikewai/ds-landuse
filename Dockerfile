# Create image based on the official Node 6 image from dockerhub
FROM node:6

RUN useradd -ms /bin/bash bower
# Create a directory where our app will be placed
RUN mkdir -p /usr/src/

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/

# Get all the code needed to run the app
COPY . /usr/src/

# Install dependencies
RUN npm install

RUN npm install grunt-cli -g

# install bower
RUN npm install --global bower

USER bower

# Install Bower devDependencies
RUN bower Install

USER root
# Expose the port the app runs in
EXPOSE 9000

# Serve the app
CMD ["grunt", "serve"]
