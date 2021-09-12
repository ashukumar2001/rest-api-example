import express from "express";
import { DATABASE_URL, PORT } from "./config/index.js";
import router from "./routers/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import mongoose from "mongoose";
const app = express();
app.use(express.json());
app.use("/api", router);

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.warn("Connected to Database..."));

app.get("/", (req, res) => {
  console.log(DATABASE_URL);
  res.send({
    message: "Hello",
  });
});
app.use(errorHandler);
app.listen(PORT, () =>
  console.warn(`server running at http://localhost:${PORT}`)
);
