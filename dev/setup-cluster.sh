#!/bin/sh -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

kind create cluster --name cluster-fy --config $DIR/cluster-config.yaml

kubectl create namespace fy

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

sed -i "127.0.0.1  www.dev.fy.com dev.fy.com api.fy.com" /etc/hosts
