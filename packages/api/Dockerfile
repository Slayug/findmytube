FROM node:17-alpine3.14

WORKDIR /home/node

COPY logger ./logger
COPY core ./core
COPY api ./api

RUN cd api && npm install --production
RUN rm core/node_modules -rf
RUN rm core/src -rf
RUN rm logger/node_modules -rf
RUN rm logger/src -rf


FROM node:17-alpine3.14

WORKDIR /home/node

COPY --from=0 /home/node/api api/
COPY --from=0 /home/node/logger logger
COPY --from=0 /home/node/core core/

CMD ["node", "api/dist/main"]
