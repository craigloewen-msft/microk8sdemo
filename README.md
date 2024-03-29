# Microk8s demo

## Getting Started

### Set up

#### Make sure systemd is enabled in WSL
- https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/

#### Install the npm packages
- Install npm packages: `npm install && cd frontend && npm install && cd ../backend && npm install && cd ..`

#### Install microk8s
- Instructions here: https://microk8s.io/docs/getting-started
- Add yourself to microk8s access with: `sudo usermod -a -G microk8s $USER` 
- Make sure microk8s is running with `sudo microk8s status`

#### Set up a local registry with the image

You need to deploy microk8s locally with a docker container registry running.

- Install microk8s https://microk8s.io/docs/getting-started
- Enable a registry with `docker run -d -p 32000:5000 --restart=always --name registry registry:2`
- Build the container `cd ./server-backend && docker build . -t localhost:32000/microk8sdemo:latest && cd ..`
- Push the image to the registry `docker push localhost:32000/microk8sdemo:latest` 

#### Apply the microk8s image 

- Run `microk8s kubectl apply -f ./kubedeploy`

### Run the sample

Run `npm run dev` to run this

### Change the number of servers

Run this to change servers to 8: `microk8s kubectl scale --replicas=8 deployment/microk8sdemo`


## Full list of commands to run to get started

- git clone https://github.com/craigloewen-msft/microk8sdemo.git
- cd microk8sdemo
- curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
- source ~/.bashrc
- nvm install 16
- nvm use 16
- npm install && cd frontend && npm install && cd ../backend && npm install && cd ..
- sudo snap install microk8s --classic --channel=1.27
- sudo usermod -a -G microk8s $USER
- Close and reload WSL window
- curl -fsSL https://get.docker.com -o get-docker.sh
- sudo sh get-docker.sh
- sudo docker run -d -p 32000:5000 --restart=always --name registry registry:2
- cd ./server-backend && sudo docker build . -t localhost:32000/microk8sdemo:latest && cd ..
- sudo docker push localhost:32000/microk8sdemo:latest
- microk8s kubectl apply -f ./kubedeploy
- npm run dev

