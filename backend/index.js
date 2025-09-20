import dotenv from "dotenv";
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import mlRoutes from './routes/mlRoutes.js'
import restaurantRoutes from "./routes/resRoutes.js"

const app = express();
app.use(express.json());


const allowedOrigins = [
  'http://localhost:5173',
  'https://be-spicy-sand.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// Routes
app.use('/ml', mlRoutes);
app.use("/restaurants", restaurantRoutes);


const PORT =  process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
