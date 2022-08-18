import { PromiseTimeout } from "./helpers.js";
let globalClientID = 0;

export default class client {
    constructor(webSocket, failureCallback, windowInnerWidth, divWidth, serverDivHeight) {
        this.status = "starting"
        this.id = globalClientID;
        globalClientID++;
        this.webSocket = webSocket;
        this.failureCallback = failureCallback
        this.removing = false;

        this.x = (windowInnerWidth - (divWidth / 2)) * Math.random();
        this.y = 100 * Math.random() + serverDivHeight + 100;

        this.startRequest();
        this.startLeaveTimer();
    }

    async startRequest() {
        // Get IP address for the node
        try {
            this.status = "requesting";
            this.webSocket.send(JSON.stringify({ function: "getip", data: { clientID: this.id } }));
        } catch (error) {
            this.startExit("failed");
        }
    }

    async doRequest(inIP) {
        this.ip = inIP;
        try {
            this.webSocket.send(JSON.stringify({ function: "dorequest", data: { clientID: this.id, ip: this.ip } }))
        } catch (error) {
            this.startExit("failed");
        }
    }

    async finishRequest(callback) {
        if (this.status == "requesting") {
            this.startExit("done");
            callback();
        }
    }

    async startLeaveTimer() {
        await PromiseTimeout(10000);
        if (this.status == "requesting") {
            this.startExit("left");
            this.failureCallback();
        }
    }

    async startExit(status) {
        this.status = status
        this.removing = true;
        await PromiseTimeout(20000);
        this.readyToRemove = true;
    }
}