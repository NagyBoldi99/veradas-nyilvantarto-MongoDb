import { Request, Response } from 'express';
import { Donor } from '../entity/Donor';
import { validateTaj } from '../utils/taj-validator';

export const createDonor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, gender, citizenship, birthPlace, birthDate, address, tajNumber } = req.body;

    if (!name || !gender || !citizenship || !birthPlace || !birthDate || !address || !tajNumber) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate TAJ before saving
    if (!validateTaj(tajNumber)) {
      res.status(400).json({ message: 'Invalid TAJ number' });
      return;
    }

    const newDonor = new Donor({ 
      name, 
      gender, 
      citizenship, 
      birthPlace, 
      birthDate, 
      address, 
      tajNumber 
    });
    
    const savedDonor = await newDonor.save();
    res.status(201).json(savedDonor);
  } catch (error: any) { // Add proper typing
    console.error(error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const getAllDonors = async (req: Request, res: Response): Promise<void> => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error: any) { // Add proper typing
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
