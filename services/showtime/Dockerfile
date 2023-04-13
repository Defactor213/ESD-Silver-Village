FROM node:16-bullseye

RUN yarn global add prisma

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD ["yarn", "dev"]
