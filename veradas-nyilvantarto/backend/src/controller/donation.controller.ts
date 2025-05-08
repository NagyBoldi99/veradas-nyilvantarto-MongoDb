import { Request, Response } from 'express';
import { Donation } from '../entity/Donation';
import { Donor } from '../entity/Donor';
import { Location } from '../entity/Location';
import { validateTaj } from '../utils/taj-validator';
import mongoose from 'mongoose';

export const createDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      locationId,
      donorId,
      date,
      eligible,
      ineligibilityReason,
      doctorName,
      directedDonation,
      patientName,
      patientTaj
    } = req.body;

    console.log('Received donation data:', req.body); // Debug logging

    // Validation
    if (!locationId || !donorId || !date || eligible === undefined || !doctorName || directedDonation === undefined) {
      res.status(400).json({ message: 'Missing required fields', 
        missing: {
          locationId: !locationId,
          donorId: !donorId,
          date: !date,
          eligible: eligible === undefined,
          doctorName: !doctorName,
          directedDonation: directedDonation === undefined
        } 
      });
      return;
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(locationId) || !mongoose.Types.ObjectId.isValid(donorId)) {
      res.status(400).json({ message: 'Invalid location or donor ID format' });
      return;
    }

    // Check if location and donor exist
    const [location, donor] = await Promise.all([
      Location.findById(locationId),
      Donor.findById(donorId)
    ]);

    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    if (!donor) {
      res.status(404).json({ message: 'Donor not found' });
      return;
    }

    // Directed donation validation
    if (directedDonation === true) {
      if (!patientName || !patientTaj) {
        res.status(400).json({ message: 'Patient name and TAJ are required for directed donations' });
        return;
      }

      if (!validateTaj(patientTaj)) {
        res.status(400).json({ message: 'Invalid patient TAJ number' });
        return;
      }
    }

    // Ineligibility reason validation
    if (eligible === false && !ineligibilityReason) {
      res.status(400).json({ message: 'Reason is required for ineligible donations' });
      return;
    }

    // Prepare donation object with only the needed fields
    const donationData: any = {
      location: locationId,
      donor: donorId,
      date: new Date(date), // Ensure proper Date object
      eligible,
      doctorName,
      directedDonation
    };

    // Add conditional fields
    if (!eligible) {
      donationData.ineligibilityReason = ineligibilityReason;
    }
    
    if (directedDonation) {
      donationData.patientName = patientName;
      donationData.patientTaj = patientTaj;
    }

    console.log('Creating donation with data:', donationData); // Debug logging

    // Create and save the donation
    const donation = new Donation(donationData);
    const savedDonation = await donation.save();
    
    // Populate the references for the response
    await savedDonation.populate(['donor', 'location']);
    
    console.log('Donation saved successfully:', savedDonation._id); // Debug logging
    res.status(201).json(savedDonation);
  } catch (error: any) {
    console.error('Error saving donation:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors,
        details: error.message
      });
    } else {
      res.status(500).json({ 
        message: 'Server error saving donation', 
        error: error.message 
      });
    }
  }
};

export const getAllDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { locationId, donorId, dateFrom, dateTo } = req.query;

    // Build the filter object
    const filter: any = {};
    
    if (locationId) {
      filter.location = locationId;
    }
    
    if (donorId) {
      filter.donor = donorId;
    }
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom as string);
      if (dateTo) filter.date.$lte = new Date(dateTo as string);
    }

    const donations = await Donation.find(filter)
      .populate('donor')
      .populate('location');
      
    res.json(donations);
  } catch (error: any) { // Add proper typing
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


