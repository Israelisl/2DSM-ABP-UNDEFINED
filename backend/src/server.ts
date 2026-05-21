import express from "express";
import cors from "cors";
import navigationRoutes from "./routes/navigation.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import authRouter from "./routes/auth.routes";
import logsRoutes from "./routes/logs.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/navigation", navigationRoutes);
app.use("/inquiries", inquiryRoutes); 
app.use("/auth", authRouter); 
app.use("/logs", logsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});