const express = require("express");
const app = express();


app.use("/", (req, res) => {
    res.send("Hello World from the server");
});

app.listen(3001, () => {
    console.log("Server is successfully listening on port 3000");
   });
