import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dbConnect from "./config/dbConnet.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"


const app = express()
const PORT = 3000

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/v1/", userRoutes)
app.use("/api/v1/", postRoutes)

app.listen(PORT, () => {
    console.log("server is running");
    dbConnect()
})

