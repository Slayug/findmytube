FROM node:17-alpine3.14

ARG PACKAGE
WORKDIR /home/node

COPY core ./core
COPY $PACKAGE/ $PACKAGE/

RUN cd $PACKAGE && npm install --production

RUN rm core/node_modules -rf
RUN rm core/src -rf


FROM node:17-alpine3.14

ARG PACKAGE

WORKDIR /home/node

COPY --from=0 /home/node/$PACKAGE $PACKAGE/
COPY --from=0 /home/node/core core/

CMD ["node", "channel-worker/dist/index"]
