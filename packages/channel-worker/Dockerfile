FROM node:17-alpine3.14

ARG PACKAGE
WORKDIR /home/node

COPY tsconfig.json tsconfig.json
COPY core ./core
COPY $PACKAGE/ $PACKAGE/

RUN cd $PACKAGE && npm install --production

RUN rm /home/node/core/node_modules -rf
RUN npm cache clean --force

WORKDIR /home/node/$PACKAGE

CMD ["npx", "ts-node", "--transpile-only", "src/index.ts"]
