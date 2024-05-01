#!/bin/bash -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ENV="${1:-dev}"

if [ "$ENV" == "prod" ] || [ "$ENV" == "ovh" ]; then
  helm upgrade --install ingress-nginx ingress-nginx \
    --repo https://kubernetes.github.io/ingress-nginx \
    --namespace ingress-nginx --create-namespace
  $DIR/../charts/cert-manager/setup.sh
else
  $DIR/setup-cluster.sh
fi
$DIR/../charts/redis/setup.sh

kubectl create -f https://download.elastic.co/downloads/eck/2.11.1/crds.yaml
kubectl apply -f https://download.elastic.co/downloads/eck/2.11.1/operator.yaml

helm upgrade --install findmytube-elastic ./charts/elastic -f ./charts/values/$ENV.yaml
helm upgrade --install findmytube-redis ./charts/redis -f ./charts/values/$ENV.yaml
helm upgrade --install findmytube-issuer ./charts/issuer -f ./charts/values/$ENV.yaml
helm upgrade --install findmytube-www ./charts/www/ -f ./charts/values/$ENV.yaml
helm upgrade --install findmytube-video-worker ./charts/video-worker/ -f ./charts/values/$ENV.yaml
helm upgrade --install findmytube-channel-worker ./charts/channel-worker/ -f ./charts/values/$ENV.yaml
helm upgrade --install findmytube-producer ./charts/producer/ -f ./charts/values/$END.yaml
helm upgrade --install findmytube-cron-channel-producer ./charts/cron-channel-producer/ -f ./charts/values/$ENV.yaml
helm upgrade --install findmytube-api ./charts/api/ -f ./charts/values/$ENV.yaml
