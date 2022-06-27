#!/bin/sh -x
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

helm repo add elastic https://helm.elastic.co

helm install elasticsearch elastic/elasticsearch -f $DIR/values.yaml -n findmytube
