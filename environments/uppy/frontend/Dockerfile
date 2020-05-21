# base image
FROM node:12

# set working directory
WORKDIR /app

COPY . .

ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

# start app
CMD ["npm", "start"]
