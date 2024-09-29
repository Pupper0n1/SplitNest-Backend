import express from 'express';
import sequelize from './config/db';
import authRoutes from './routes/auth';

const app = express();

// Sync Sequelize models with the database
sequelize
  .sync()
  .then(() => console.log('Database connected and models synced'))
  .catch((err) => console.error('Error connecting to the database:', err));

app.use(express.json());

app.use('/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
