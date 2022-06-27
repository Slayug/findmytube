#!/bin/sh -x

yarn install
yarn run build

docker build . -t findmytube-www
