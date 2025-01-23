import express, { Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDb() {
  return open({
    filename: './src/data/findings.db',
    driver: sqlite3.Database
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health route
app.get('/api/health', (req: Request, res: Response) => {
  res.send({ status: 'Server is healthy' });
});

// Return all rows from raw_findings
app.get('/api/findings/raw', async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const rawRows = await db.all('SELECT * FROM raw_findings');
    res.send(rawRows);
  } catch (error) {
    res.status(500).send('Error fetching raw findings');
  }
});

// Return all rows from grouped_findings
app.get('/api/findings/grouped', async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const groupedRows = await db.all('SELECT * FROM grouped_findings');
    res.send(groupedRows);
  } catch (error) {
    res.status(500).send('Error fetching grouped findings');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});