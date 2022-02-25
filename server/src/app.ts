import express = require("express");
import { executeTVCommand } from "./commands";

if(process.argv.length < 3) {
    console.error("Not enough arguments specified");
}

const port = +process.argv[2];
const app = express();
app.get("/health", (req, res) => res.sendStatus(200));

app.get("/execute/:id", async (req, res) => {
    const id = +req.params.id;
    console.log("Got id" + id);
    try {
        const response = await executeTVCommand(id);
        res.sendStatus(200);
    } catch (err) {
        res.statusCode = 500;
        res.send(err);
    }
});

app.listen(port, () => console.log("Listening on port " + port));