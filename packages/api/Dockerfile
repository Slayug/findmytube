FROM node:17-alpine3.14

WORKDIR /home/node

COPY core ./core
COPY api ./api

RUN cd api && npm install
RUN rm core/node_modules -rf
RUN rm core/src -rf


FROM node:17-alpine3.14

WORKDIR /home/node

COPY --from=0 /home/node/api api/
COPY --from=0 /home/node/core core/

CMD ["node", "api/dist/main"]
