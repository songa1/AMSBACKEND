import express from "express";
import route from "./Routers";

const app = express();
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log("Server is running on port " + PORT));

app.use("/api", route);

export default app;
