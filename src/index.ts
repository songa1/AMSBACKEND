import express from "express";
import route from "./Routers";
import bodyParser from "body-parser";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", route);

const server = app.listen(PORT, () =>
  console.log("Server is running on port " + PORT)
);



export default app;
