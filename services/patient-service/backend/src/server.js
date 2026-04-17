import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import patientRoutes from './routes/patientRoutes.js';
import   dbConfig from '../src/config/db.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'Patient Service' });
});

app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`patient Service running on ${PORT}`));

 

const testDB = async () => {
  try {
    const res = await dbConfig.query("SELECT NOW()");
    console.log("✅ DB Connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
};

testDB();