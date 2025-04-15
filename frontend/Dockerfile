FROM node:18
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV VITE_API_URL=http://backend:3000
CMD ["npm", "run", "dev"]
