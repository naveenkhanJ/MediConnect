import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import patientRoutes from './routes/patientRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/patients', patientRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});