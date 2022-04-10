FROM node:lts-alpine

WORKDIR /

COPY dist/ projectsjobs/

WORKDIR projectsjobs

RUN npm install --production

EXPOSE 3000

CMD ["node", "src/index.js"]
