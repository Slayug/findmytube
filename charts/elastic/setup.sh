helm repo add elastic https://helm.elastic.co

helm install elasticsearch elastic/elasticsearch -f ./values.yaml -n fy
