#!/bin/bash

docker build -t localhost:32000/microk8sdemo:latest ./server-backend
docker push localhost:32000/microk8sdemo:latest

microk8s kubectl delete -f ./kubedeploy
microk8s kubectl apply -f ./kubedeploy
