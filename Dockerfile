FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install chart.js && \
    npm install --production

# COPY build ./build

RUN npm install axios

COPY . .

EXPOSE 3000

CMD ["npm", "start"]


# FROM node:14-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install --production

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]
