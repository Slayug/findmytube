#!/bin/sh -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV="${1:-home}"

helm repo add bitnami https://charts.bitnami.com/bitnami
#helm upgrade --install findmytube-redis-bitnami bitnami/redis -f $DIR/values-$ENV.yaml
helm upgrade --install findmytube-redis-bitnami oci://registry-1.docker.io/bitnamicharts/redis -f $DIR/values-$ENV.yaml

# get redis password
export REDIS_PASSWORD=$(kubectl get secret --namespace findmytube findmytube-redis-bitnami -o jsonpath="{.data.redis-password}" | base64 -d)

