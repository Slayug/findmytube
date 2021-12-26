#!/bin/sh -x

docker-compose -f ./docker/dev.yaml up -d
lerna run dev --stream

