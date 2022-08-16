const { default: execSh } = require('exec-sh');
const express = require('express');
const app = express();
const fs = require('fs');
const execShPromise = require("exec-sh").promise;
const axios = require('axios');

const WebSocket = require("ws");
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 9990 });

// Configure Vue Specific set up

app.use(express.static(__dirname + "/dist"));

// More server set up

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let hostPort = 3000;
let myIPAddress = "0";

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
  myIPAddress = add;
})

const port = hostPort;
app.listen(port, () => console.log('App listening on port ' + port));

// Start up containers

let endpointIP = "";
let endpointPort = 3000;

async function startUpContainers() {
  try {
    // TODO: Add check if container already exists

    // This part is only necessary for in WSL
    let enterNameSpace = await execShPromise("sudo enter-systemd-namespace", true);

    let containerIPAddress = await execShPromise("microk8s kubectl get service/microk8sdemo -o jsonpath='{.spec.clusterIP}'", true);

    endpointIP = containerIPAddress.stdout.replace(/[\n\r]+/g, '');

    // let containerStartup = await execShPromise("cd .. && docker-compose up -d", true);
    // console.log(containerStartup);
  } catch (error) {
    console.log("Error: ", error);
  }

  if (endpointIP == "") {
    throw "Endpoint not set up correctly error";
  }
}

startUpContainers();

// Helper functions

function getCallUrl(apiEndpoint) {
  return 'http://' + endpointIP + ":" + endpointPort + apiEndpoint;
}

/* ROUTES */

app.get('/api/getservers', async (req, res, next) => {
  try {

    let podsInfoListShOut = await execShPromise("microk8s kubectl get pod -o wide | grep -i microk8sdemo ", true);
    let podsInfoList = podsInfoListShOut.stdout;

    let podsInfoArray = podsInfoList.replace(/[\n\r]+/g, ',').split(',');
    podsInfoArray.splice(podsInfoArray.length - 1, 1);

    let returnPodInfoArray = [];

    for (let i = 0; i < podsInfoArray.length; i++) {
      let podInfoVisitor = podsInfoArray[i];
      let podInfo = podInfoVisitor.replace(/[ ]+/g, ',').split(',');
      returnPodInfoArray.push({ status: podInfo[2], ip: podInfo[5] })
    }

    res.json(returnPodInfoArray);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});


async function getip(inData) {
  let clientID = inData.clientID;
  try {
    let callURL = getCallUrl('/api/getip');
    let response = await axios.get(callURL);
    return JSON.stringify({ function: "getipreturn", data: { clientID: clientID, ip: response.data } })
  } catch (error) {
    console.log(error);
    return JSON.stringify({});
  }
}

async function doRequest(inData) {
  let clientID = inData.clientID
  try {
    let inputIP = inData.ip
    let callURL = 'http://' + inputIP + ':3000/api/dorequest';
    let response = await axios.get(callURL);
    return JSON.stringify({ function: "dorequestreturn", data: { clientID: clientID } })
  } catch (error) {
    console.log(error);
    return JSON.stringify({});
  }
}

async function scale(inData) {
  let clientID = inData.clientID
  try {
    let count = inData.count;
    let podsIPListShOut = await execShPromise("microk8s kubectl scale --replicas=" + count + " deployment/microk8sdemo", true);
  } catch (error) {
    console.log(error);
  }
}

async function getServers(inData) {
  let clientID = inData.clientID
  try {
    let podsInfoListShOut = await execShPromise("microk8s kubectl get pod -o wide | grep -i microk8sdemo ", true);
    let podsInfoList = podsInfoListShOut.stdout;

    let podsInfoArray = podsInfoList.replace(/[\n\r]+/g, ',').split(',');
    podsInfoArray.splice(podsInfoArray.length - 1, 1);

    let returnPodInfoArray = [];

    for (let i = 0; i < podsInfoArray.length; i++) {
      let podInfoVisitor = podsInfoArray[i];
      let podInfo = podInfoVisitor.replace(/[ ]+/g, ',').split(',');
      returnPodInfoArray.push({ status: podInfo[2], ip: podInfo[5] })
    }
    return JSON.stringify({ function: "refreshserverinforeturn", data: { servers: returnPodInfoArray } })
  } catch (error) {
    console.log(error);
    return JSON.stringify({});
  }
}

wss.on("connection", (ws) => {
  // A connection has been made
  // send back a message
  ws.on("message", async (message) => {
    let inJSON = JSON.parse(message);
    console.log(inJSON);
    let inFunction = inJSON.function;
    let inData = inJSON.data;

    if (inFunction == "getip") {
      let response = await getip(inData);
      ws.send(response);
    } else if (inFunction == "dorequest") {
      let response = await doRequest(inData)
      ws.send(response);
    } else if (inFunction == "scale") {
      await scale(inData)
    } else if (inFunction == "refreshserverinfo") {
      let response = await getServers(inData)
      ws.send(response);
    }
  });
});