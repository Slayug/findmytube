#!/bin/sh -x

yarn install
yarn run build

docker build . -t fy-www