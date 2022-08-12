#!/bin/sh -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# Add kubernetes-dashboard repository
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
# Deploy a Helm Release named "kubernetes-dashboard" using the kubernetes-dashboard chart
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard -f $DIR/values.yaml

echo "==============================="
echo "  SETUP SERVICE ACCOUNT "
echo "==============================="

kubectl apply -f $DIR/dashboard-adminuser.yaml
