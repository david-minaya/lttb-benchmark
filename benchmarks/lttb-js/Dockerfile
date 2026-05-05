FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "--import=./instrumentation.js", "index.js"]
