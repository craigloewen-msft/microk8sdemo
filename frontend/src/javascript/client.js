import { PromiseTimeout } from "./helpers.js";
let globalClientID = 0;

export default class client {
    constructor(webSocket) {
        this.status = "starting"
        this.id = globalClientID;
        globalClientID++;
        this.webSocket = webSocket;
        this.startRequest();
        this.startLeaveTimer();
    }

    async startRequest() {
        // Get IP address for the node
        try {
            this.status = "requesting";
            this.webSocket.send(JSON.stringify({ function: "getip", data: { clientID: this.id } }));
        } catch (error) {
            this.status = "failed";
        }
    }

    async doRequest(inIP) {
        this.ip = inIP;
        try {
            this.webSocket.send(JSON.stringify({ function: "dorequest", data: { clientID: this.id, ip: this.ip } }))
        } catch (error) {
            this.status = "failed";
        }
    }

    async finishRequest() {
        this.status = "done";
    }

    async startLeaveTimer() {
        await PromiseTimeout(10000);
        if (this.status == "requesting") {
            this.status = "left";
        }
    }
}