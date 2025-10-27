import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import planRoutes from "./routes/planRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/plans", planRoutes);

const PORT = Number(process.env.PORT) || 5003;
const IS_VERCEL = process.env.ON_VERCEL || false;

console.log(IS_VERCEL);

if(IS_VERCEL){
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
}
else{
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}