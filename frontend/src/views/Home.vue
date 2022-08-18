<template>
  <div class="main-box">
    <h1>Microk8s demo</h1>
    <div class="controls">
      <div>
        <div class="controls-label">Milliseconds per client: </div>
        <input type="text" v-model="inMSPerClient" />
        <button v-on:click="setMSPerClient()">Set</button>
      </div>
      <div>
        <div class="controls-label">Number of severs: </div>
        <input type="text" v-model="serversCount" />
        <button v-on:click="setServerCount()">Set</button>
      </div>
      <div>
        <div>Successful requests: {{ completedRequestsCount }}</div>
        <div>Failed requests: {{ failedRequestsCount }}</div>
        <button v-on:click="clearCounters()">Reset</button>
      </div>
    </div>

    <div class="canvas">
      <div class="server-box">
        <serverRender v-for="(server, serverIndex) in servers" v-bind:key="serverIndex" :text="server"
          :inLeftMargin="getServerPosition(serverIndex) + 'px'" />
      </div>

      <div class="dnslayer">
        MyWebsite.com
      </div>

      <div class="client-box">
        <div v-for="client in clientDictionary" v-bind:key="client.id">
          <clientRender :statusText="client.status" :removing="client.removing" :text="client"
            :inLeftMargin="getClientX(client.id) + 'px'" :inTopMargin="getClientY(client.id) + 'px'">
          </clientRender>
          <connectionRender v-if="client.ip" :removing="client.removing"
            :sourceX="String(getServerPositionFromClient(client.id) + serverDivWidth / 2)" :sourceY="'60'"
            :midX="midWindowWidthString" :midY="'190'" :destX="String(getClientX(client.id) + serverDivWidth / 2)"
            :destY="String(getClientY(client.id) + serverDivHeight / 2)" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import client from "../javascript/client";
import clientRender from "../components/clientRender.vue"
import serverRender from "../components/serverRender.vue"
import connectionRender from "../components/connectionRender.vue"

export default {
  name: "Home",
  data: function () {
    return {
      inMSPerClient: 10000,
      msPerClient: 10000,
      serversCount: 1,
      clientDictionary: {},
      servers: [],
      tickTime: 300,
      webSocket: null,
      completedRequestsCount: 0,
      failedRequestsCount: 0,
      serverDivWidth: 88,
      serverDivHeight: 120,
    }
  },
  components: {
    clientRender,
    serverRender,
    connectionRender
  },
  computed: {
    midWindowWidthString: function () {
      return String(window.innerWidth / 2);
    }
  },
  methods: {
    recursiveAddNewClient() {
      let newClient = new client(this.webSocket, this.addFail.bind(this), window.innerWidth, this.serverDivWidth, this.serverDivHeight);
      this.clientDictionary[newClient.id] = newClient;

      setTimeout(
        this.recursiveAddNewClient.bind(this),
        Math.random() * this.msPerClient,
      )
    },
    clearFinishedClients() {
      let clientList = Object.keys(this.clientDictionary);
      for (let i = 0; i < clientList.length; i++) {
        let clientVisitor = this.clientDictionary[clientList[i]];
        if (clientVisitor.readyToRemove) {
          delete this.clientDictionary[clientVisitor.id]
        }
      }
    },
    simulationTick() {
      try {
        this.clearFinishedClients();
        this.refreshServerInfo();
        // this.$forceUpdate();
      } catch (error) {
        console.log("Simulation error: ", error);
      }

      setTimeout(
        this.simulationTick.bind(this),
        Math.random() * this.tickTime,
      )
    },
    refreshServerInfo() {
      this.webSocket.send(JSON.stringify({ function: "refreshserverinfo", data: {} }))
    },
    setServerCount() {
      this.webSocket.send(JSON.stringify({ function: "scale", data: { count: this.serversCount } }))
    },
    setMSPerClient() {
      this.msPerClient = this.inMSPerClient;
    },
    clearCounters() {
      this.completedRequestsCount = 0;
      this.failedRequestsCount = 0;
    },
    handleWebSocketMessage(event) {
      // This function is called when the web socket receives a message.
      let eventData = JSON.parse(event.data)
      let inFunction = eventData.function;
      let inData = eventData.data;

      let clientID = 0;
      let clientVisitor = null;

      // Handle the message.
      if (inData) {
        clientID = inData.clientID;
        clientVisitor = this.clientDictionary[clientID];
      }

      if (inFunction == "getipreturn") {
        clientVisitor.doRequest(inData.ip);
      } else if (inFunction == "dorequestreturn") {
        if (clientVisitor) {
          clientVisitor.finishRequest(this.addSuccess.bind(this));
        }
      } else if (inFunction == "refreshserverinforeturn") {
        this.servers = inData.servers;
      }
    },
    clients: function () {
      let clientList = Object.keys(this.clientDictionary);
      let returnList = [];
      for (let i = 0; i < clientList.length; i++) {
        let clientVisitor = this.clientDictionary[clientList[i]];
        returnList.push(clientVisitor);
      }
      return returnList;
    },
    addSuccess: function () {
      this.completedRequestsCount = this.completedRequestsCount + 1;
    },
    addFail: function () {
      this.failedRequestsCount = this.failedRequestsCount + 1;
    },
    getServerPosition(serverIndex) {
      return (serverIndex + 1) * 1.0 * window.innerWidth / (this.servers.length + 1) - (this.serverDivWidth / 2);
      // (serverIndex + 1) * 100.0 / (servers.length + 1) + 
    },
    getClientX(clientID) {
      return this.clientDictionary[clientID].x;
    },
    getClientY(clientID) {
      return this.clientDictionary[clientID].y;
    },
    getServerPositionFromClient(clientID) {
      let ip = this.clientDictionary[clientID].ip;

      // Find the server from the client ip
      for (let i = 0; i < this.servers.length; i++) {
        if (this.servers[i].ip == ip) {
          return this.getServerPosition(i);
        }
      }
    }
  },
  mounted: function () {
    this.webSocket = new WebSocket("ws://localhost:9990");
    this.webSocket.addEventListener('message', this.handleWebSocketMessage.bind(this));

    setTimeout(function () {
      this.recursiveAddNewClient();
      this.simulationTick();
    }.bind(this), 3000);
  }
};
</script>

<style>
.canvas {
  width: 100%;
  height: 80%;
  min-height: 600px;
}

.main-box {
  height: 100%;
}

.dnslayer {
  position: absolute;
  font-weight: bold;
  text-align: center;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 160px;
  font-size: 2em;
  background-color: rgb(208, 244, 255);
  border-radius: 30px;
  width: 100%;
}

#app {
  height: 100%;
}

.client-box {
  width: 100%;
}
</style>