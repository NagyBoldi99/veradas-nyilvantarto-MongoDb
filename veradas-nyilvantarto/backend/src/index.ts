import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import locationRoutes from './routes/location.routes';
import donorRoutes from './routes/donor.routes';
import donationRoutes from './routes/donation.routes';
import userRoutes from './routes/user.routes';


const app = express();
app.use(cors());
app.use(express.json());

// Útvonalak :
app.use('/auth', userRoutes);
app.use('/donations', donationRoutes); 
app.use('/donors', donorRoutes);
app.use('/locations', locationRoutes); 

AppDataSource.initialize()
  .then(() => {
    console.log('Adatbázis kapcsolat sikeres!');
    app.listen(3000, () => {
      console.log('Szerver fut a http://localhost:3000 címen');
    });
  })
  .catch((err) => {
    console.error('Hiba az adatbázis kapcsolódás során:', err);
  });
