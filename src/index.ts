import express from "express";
import route from "./Routers";
import bodyParser from "body-parser";
import cors from "cors";
import cron from "node-cron";
import { generateProfileUpdateNotifications } from "./controllers/notificationController";

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", route);

app.listen(PORT, () => console.log("Server is running on port " + PORT));

cron.schedule("0 * * * *", async () => {
  console.log("Cron Ready!");
  await generateProfileUpdateNotifications();
  console.log(
    "Scheduled task executed: Profile update notifications created for users who have not updated their profiles in over a month."
  );
});

export default app;
