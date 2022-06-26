#!/bin/sh -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

helm repo add bitnami https://charts.bitnami.com/bitnami
helm install fy-redis bitnami/redis

# get redis password
export REDIS_PASSWORD=$(kubectl get secret --namespace fy fy-redis -o jsonpath="{.data.redis-password}" | base64 -d)

