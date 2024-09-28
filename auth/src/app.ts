import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from auth service!');
});

// Start server
app.listen(PORT, () => {
  console.log('$SERVICE service running on port', PORT);
});
