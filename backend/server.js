import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import balanceRoutes from './routes/balanceRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/balance', balanceRoutes);


app.get('/', (req, res) => {
  res.send('MERN Backend API is running smoothly.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
