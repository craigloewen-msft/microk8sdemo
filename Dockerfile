FROM node:14

WORKDIR /app/

COPY . .

RUN npm run build

ENV NODE_ENV=production   

CMD [ "npm", "run", "start"]