FROM node:lts-alpine

WORKDIR /usr/src/app

COPY *lock.json ./

RUN yarn

# Copy application code
COPY . .

COPY prisma ./prisma/

RUN npx prisma generate
RUN npx prisma migrate

EXPOSE 3000

CMD ["node", "--watch","src/app.ts"]