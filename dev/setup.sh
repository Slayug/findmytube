#!/bin/sh -x

# setup dev deps

yarn install
yarn run bootstrap

pip install -r packages/requirements

npm install pm2 -g
pm2 install typescript
