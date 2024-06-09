import express from "express";
import route from "./Routers";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 7000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(PORT, () => console.log("Server is running on port " + PORT));

app.use('/api', route)

export default app;
