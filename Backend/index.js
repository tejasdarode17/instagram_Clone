import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dbConnect from "./config/dbConnet.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import cloudinaryConfig from "./config/cloudinary.js"

const app = express()
const PORT = 3000

const allowedOrigins = [
    "http://localhost:5173",
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
};


app.use(cors(corsOptions)); 
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", userRoutes)
app.use("/api/v1/", postRoutes)
app.use("/api/v1/", commentRoutes)

app.listen(PORT, () => {
    console.log("server is running");
    dbConnect();
    cloudinaryConfig()
})

