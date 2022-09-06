# Microk8s demo

## Getting Started

You need to deploy microk8s locally with a docker container registry running.

- Install microk8s https://microk8s.io/docs/getting-started
- Enable a registry with `docker run -d -p 32000:5000 --restart=always --name registry registry:2`
- Build the container `cd ./server-backend && docker build . -t localhost:32000/microk8sdemo:latest && cd ..`
- Push the image to the registry `docker push localhost:32000/microk8sdemo:latest` 

### Instructions that don't work so well
- Install microk8s https://microk8s.io/docs/getting-started
- Enable a registry with `microk8s enable registry` https://microk8s.io/docs/registry-built-in
- Build the container `cd ./server-backend && docker build . -t localhost:32000/microk8sdemo:latest && cd ..`
- Push the image to the registry `docker push localhost:32000/microk8sdemo:latest` 

