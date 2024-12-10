FROM node

WORKDIR /usr/src/app

COPY app/prisma/ ./
COPY app/app.js ./
COPY app/package*.json ./

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "app.js"]