const mysql = require("mysql");
const sqlConfig = require("../../settings.json").sqlConfig;
const app = require("../app.js");

app.route("/api/comments/create")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        if (typeof req.body.articleId !== "string" || req.body.articleId === "") {
            res.status(503).send({ status: "ERROR", extra: "Vous devez renseigner l'id de l'article" });
            return;
        }
        if (typeof req.body.author !== "string" || req.body.author === "") {
            res.status(503).send({ status: "ERROR", extra: "L'auteur n'est pas renseigné" });
            return;
        }
        if (typeof req.body.content !== "string" || req.body.content === "") {
            res.status(503).send({ status: "ERROR", extra: "Le contenu de du commentaire est vide" });
            return;
        }
        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "INSERT INTO node_comments(articleId, author, content) VALUES (?,?,?);",
            [req.body.articleId, req.body.author, req.body.content],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({
                        status: "OK", result: {
                            commentId: result.insertId
                        }});
                }
                sqlConnection.end();
            }
        );
    });

app.route("/api/comments/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        if (typeof req.body.id !== "number" || req.body.id <= 0) {
            res.status(503).send({ status: "ERROR", extra: "Vous devez renseigner un id du commentaire" });
            return;
        }

        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "DELETE FROM node_comments WHERE id = ?",
            [req.body.id],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    if (result.affectedRows === 0) {
                        res.status(503).send({ status: "ERROR", extra: "le commentaire n'existe pas." });
                    } else {
                        res.send({ status: "OK" });
                    }
                }
                sqlConnection.end();
            }
        );
    });

app.get("/api/comments", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);

    sqlConnection.query(
        "SELECT node_comments.id, articleId, content, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_comments"
        + "  LEFT JOIN node_users"
        + "  ON node_comments.author = node_users.id"
        + "  WHERE articleId = ?"
        + "  ORDER BY created_at DESC"
        + "  LIMIT 5;",
        [req.query.articleId],
        (error, result) => {
            if (error) {
                console.log(error.code);
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({
                    status: "OK",
                    comments: result,
                });
            }
            sqlConnection.end();
        }
    );
});