const express = require(express);
const mysql = require("mysql");

const settings = require("./settings.json");
const sqlConfig = settings.sqlConfig;

const app = express();

app.listen(3000, () => {
    console.log("LE SERVEUR DÉMARRE ...  !");
});