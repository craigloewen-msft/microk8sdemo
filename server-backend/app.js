const express = require('express');
const app = express();
const fs = require('fs');
const config = fs.existsSync('./config.js') ? require('./config') : require('./defaultconfig');

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

function PromiseTimeout(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

const port = hostPort;
app.listen(port, () => console.log('App listening on port ' + port));

// Helpers
let isComputing = false;
async function doComputations() {
  if (!isComputing) {
    isComputing = true;
    await PromiseTimeout(2000);
    isComputing = false;
    return true;
  } else {
    // Wait and try again
    await PromiseTimeout(500);
    return doComputations();
  }
}

/* ROUTES */


app.get('/api/dorequest', async (req, res, next) => {
  try {
    await doComputations();
    res.json({ data: 1 });
  } catch (error) {
    console.log(error);
    res.json("error");
  }
});

app.get('/api/getip', async (req, res, next) => {
  try {
    res.json(myIPAddress);
  } catch (error) {
    console.log(error);
    res.json("error");
  }
});