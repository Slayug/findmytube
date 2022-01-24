FROM node:17-alpine3.14

WORKDIR /home/node

COPY core ./core
COPY video-worker/ video-worker/

RUN cd video-worker && npm install --production
RUN rm core/node_modules -rf
RUN rm core/src -rf


FROM node:17-alpine3.14

WORKDIR /home/node

COPY --from=0 /home/node/video-worker video-worker/
COPY --from=0 /home/node/core core/

CMD ["node", "video-worker/dist/VideoWorker"]

