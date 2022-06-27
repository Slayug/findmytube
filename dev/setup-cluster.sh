#!/bin/sh -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

kind create cluster --name cluster-findmytube --config $DIR/cluster-config.yaml

kubectl create namespace findmytube

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

sed -i "127.0.0.1  www.dev.findmytube.io dev.findmytube.io api.findmytube.com" /etc/hosts
