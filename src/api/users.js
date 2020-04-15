const mysql = require("mysql");
const uuid = require("uuid").v4;
const sqlConfig = require("../../settings.json").sqlConfig;
const app = require("../app.js");


app.route("/api/login")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        if (typeof req.body.email !== "string" || req.body.email === "") {
            res.status(503).sens({ status: "ERROR", extra: "Vous devez entrer un email" });
            return;
        }

        if (typeof req.body.password !== "string" || req.body.password === "") {
            res.status(503).sens({ status: "ERROR", extra: "Vous devez entrer un mot de passe" });
            return;
        }

        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "SELECT id, firstname, lastname, email FROM node_users WHERE email = ? AND password = ? LIMIT 1;",
            [req.body.email, req.body.password],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    if (!result.length) {
                        res.status(503).send({ status: "ERROR", extra: "Email ou mot de passe incorrect" });
                        return;
                    }

                    // UTILISATEUR GOOD ! 
                    const userToken = uuid();
                    res.send({
                        status: "OK", infos: {
                            user: result[0],
                            userToken,
                        }});
                }
                sqlConnection.end();
            }
        );

    });
