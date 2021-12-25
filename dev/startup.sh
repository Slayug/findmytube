#!/bin/sh -x

docker-compose -f ./docker/dev.yaml up -d

npm run serve

pm2 monit