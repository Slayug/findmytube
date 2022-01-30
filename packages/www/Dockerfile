FROM node:17-alpine3.14

WORKDIR /home/node

COPY core ./core
COPY www ./www

RUN cd www && npm install --production
RUN rm core/node_modules -rf
RUN rm core/src -rf

FROM nginx:1.21.5-alpine

COPY --from=0 /home/node/www/build /usr/share/nginx/html
