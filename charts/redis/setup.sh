#!/bin/sh -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

helm repo add bitnami https://charts.bitnami.com/bitnami
helm upgrade --install findmytube-redis bitnami/redis -f $DIR/values.yaml

# get redis password
export REDIS_PASSWORD=$(kubectl get secret --namespace findmytube findmytube-redis -o jsonpath="{.data.redis-password}" | base64 -d)

