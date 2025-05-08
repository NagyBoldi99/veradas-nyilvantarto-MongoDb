import { Request, Response } from 'express';
import { Location } from '../entity/Location';
import mongoose from 'mongoose';

export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, active = true } = req.body;
    
    if (!name || !address) {
      res.status(400).json({ message: 'Name and address are required' });
      return;
    }

    const newLocation = new Location({ name, address, active });
    const savedLocation = await newLocation.save();
    
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleActive = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    
    console.log('Toggle location request for ID:', id); // Debug logging
    
    if (!id || id === 'undefined') {
      res.status(400).json({ message: 'Invalid location ID provided' });
      return;
    }
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid location ID format' });
      return;
    }

    const location = await Location.findById(id);
    console.log('Found location:', location); // Debug logging

    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    // Toggle the active property
    location.active = !location.active;
    await location.save();
    
    console.log('Location updated successfully:', location._id, 'active:', location.active); // Debug logging
    
    // Send back the updated location
    res.json(location);
  } catch (error: any) {
    console.error('Error toggling location status:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
