import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db";
import systemsRouter from "./routes/systems";
import diagnosticRoutes from "./routes/diagnostic.routes";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());

app.use("/api/upgradeHardware", systemsRouter);
app.use("/api/diagnostics", diagnosticRoutes);

const startApp = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("Error: MONGO_URI is not defined");
    }
    await connectDatabase(mongoUri);

    app.listen(PORT, () => {
      console.log(`Server listen in ${PORT}`);
    });
  } catch (error) {
    console.error("Error to start application", error);
  }
};

startApp();

app.get("/", (req, res) => {
  res.send("hola");
});
