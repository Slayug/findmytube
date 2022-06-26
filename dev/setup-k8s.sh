#!/bin/sh -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


$DIR/setup-cluster.sh
$DIR/../charts/elastic/setup.sh
$DIR/../charts/redis/setup.sh

helm upgrade --install fy-www ./charts/www/ -f ./charts/values/dev.yaml
helm upgrade --install video-worker ./charts/video-worker/ -f ./charts/values/dev.yaml
helm upgrade --install channel-worker ./charts/channel-worker/ -f ./charts/values/dev.yaml
helm upgrade --install producer ./charts/producer/ -f ./charts/values/dev.yaml
helm upgrade --install cron-channel-producer ./charts/cron-channel-producer/ -f ./charts/values/dev.yaml
helm upgrade --install api ./charts/api/ -f ./charts/values/dev.yaml
