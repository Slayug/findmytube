#!/bin/sh -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

helm repo add bitnami https://charts.bitnami.com/bitnami
helm install findmytube-redis bitnami/redis

# get redis password
export REDIS_PASSWORD=$(kubectl get secret --namespace findmytube findmytube-redis -o jsonpath="{.data.redis-password}" | base64 -d)

