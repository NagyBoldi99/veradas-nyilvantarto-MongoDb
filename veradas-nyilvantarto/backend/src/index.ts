import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './mongo-connection';
import locationRoutes from './routes/location.routes';
import donorRoutes from './routes/donor.routes';
import donationRoutes from './routes/donation.routes';
import userRoutes from './routes/user.routes';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', userRoutes);
app.use('/donations', donationRoutes);
app.use('/donors', donorRoutes);
app.use('/locations', locationRoutes);

connectToMongoDB().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
