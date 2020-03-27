const express = require("expres");
const mysql = require("mysql");

const settings = require("./settings.json");
const sqlConfig = settings.sqlConfig;

const app = express();
app.use(express.static("./public"));

app.listen(3000, () => {
    console.log("LE SERVEUR DÉMARRE ...  !");
});
app.get("/", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);

    sqlConnection.query(       
        (error, result) => {
            if (error) {
                console.log("ERROR :", error.code);
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({ status: "OK" });
            }
            sqlConnection.end();
        });
});


app.use(express.urlencoded({ extended: true }));