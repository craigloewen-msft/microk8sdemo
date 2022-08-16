<template>
  <div>
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
    </div>

    <h3>Servers</h3>
    <div>
      <li v-for="(server, serverIndex) in servers" v-bind:key="serverIndex">{{ server }}</li>
    </div>

    <h3>Clients</h3>
    <ul>
      <li v-for="client in clientDictionary" v-bind:key="client.id">{{ client }}</li>
    </ul>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import client from "../javascript/client";

export default {
  name: "Home",
  data: function () {
    return {
      inMSPerClient: 10000,
      msPerClient: 10000,
      serversCount: 1,
      clientDictionary: {},
      servers: [],
      tickTime: 60,
      webSocket: null,
    }
  },
  components: {
    // HelloWorld
  },
  computed: {
  },
  methods: {
    recursiveAddNewClient() {
      let newClient = new client(this.webSocket);
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
        if (clientVisitor.status == "done" || clientVisitor.status == "left") {
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
    handleWebSocketMessage(event) {
      let eventData = JSON.parse(event.data)
      let inFunction = eventData.function;
      let inData = eventData.data;

      let clientID = 0;
      let clientVisitor = null;

      if (inData) {
        clientID = inData.clientID;
        clientVisitor = this.clientDictionary[clientID];
      }

      if (inFunction == "getipreturn") {
        clientVisitor.doRequest(inData.ip);
      } else if (inFunction == "dorequestreturn") {
        clientVisitor.finishRequest();
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
</style>