import express from "express";
import { PORT } from "./config/index.js";
import router from "./routers/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
const app = express();
app.use(express.json());
app.use("/api", router);
app.get("/", (req, res) => {
  res.send({
    message: "Hello",
  });
});
app.use(errorHandler);
app.listen(PORT, () =>
  console.warn(`server running at http://localhost:${PORT}`)
);
