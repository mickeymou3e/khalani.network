import express from "express";
import { PORT } from "./config";
import { monitorRouter } from "./routes/monitorMinting";
import { depositsRouter } from "./routes/deposits";
import { errorHandler } from "./utils/errors";

const app = express();
app.use(express.json());

app.get("/healthz", (_req, res) => res.sendStatus(200));
app.use("/api", monitorRouter);
app.use("/api", depositsRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Service listening on port ${PORT}`);
});
