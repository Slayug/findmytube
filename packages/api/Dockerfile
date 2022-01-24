FROM node:17-alpine3.14

WORKDIR /home/node

COPY core ./core
COPY api ./api

RUN cd api && npm install

CMD ["node", "api/dist/main"]