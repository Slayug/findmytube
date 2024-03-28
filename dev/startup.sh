#!/bin/sh -x

docker-compose -f ./docker/dev.yaml up -d

lerna run --scope  @findmytube/core build --stream

#Flush pm2 processes and logs
rm -rf ~/.pm2/logs/*
pm2 kill

#lerna run dev --parallel --stream
