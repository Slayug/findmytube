#!/bin/sh -x

pip install -r requirements

npm install pm2 -g
pm2 install typescript