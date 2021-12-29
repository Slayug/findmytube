#!/bin/sh -x

docker-compose -f ./docker/dev.yaml up -d

#Flush pm2 processes logs
rm -rf ~/.pm2/logs/*
#lerna run dev --stream

