#!/bin/sh -x

pm2 kill
docker-compose -f ./docker/dev.yaml down
