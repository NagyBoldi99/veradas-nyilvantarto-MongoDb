import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Donation } from '../entity/Donation';
import { Donor } from '../entity/Donor';
import { Location } from '../entity/Location';
import { validateTaj } from '../utils/taj-validator';

const donationRepo = AppDataSource.getRepository(Donation);
const donorRepo = AppDataSource.getRepository(Donor);
const locationRepo = AppDataSource.getRepository(Location);

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

    // Ellenőrzések
    if (!locationId || !donorId || !date || !doctorName || directedDonation === undefined || eligible === undefined) {
      res.status(400).json({ message: 'Hiányzó adatok!' });
      return;
    }

    const location = await locationRepo.findOneBy({ id: locationId });
    const donor = await donorRepo.findOneBy({ id: donorId });

    if (!location || !donor) {
      res.status(404).json({ message: 'Helyszín vagy véradó nem található!' });
      return;
    }

    if (!eligible && directedDonation) {
      res.status(400).json({ message: 'Alkalmatlan jelölt nem adhat irányított vért.' });
      return;
    }

    if (directedDonation && (!patientName || !patientTaj)) {
      res.status(400).json({ message: 'Irányított véradásnál beteg neve és TAJ kötelező.' });
      return;
    }
    if (directedDonation && !validateTaj(patientTaj)) {
      res.status(400).json({ message: 'Érvénytelen beteg TAJ szám!' });
      return;
    }
    

    // Irányított véradásnál ellenőrizzük a beteg TAJ számot is (ha akarsz, itt lehet majd beépíteni egy validateTaj()-t)

    const donation = donationRepo.create({
      location,
      donor,
      date,
      eligible,
      ineligibilityReason: eligible ? null : ineligibilityReason,
      doctorName,
      directedDonation,
      patientName: directedDonation ? patientName : null,
      patientTaj: directedDonation ? patientTaj : null,
    });

    const saved = await donationRepo.save(donation);
    res.status(201).json(saved);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerverhiba' });
  }

  
};
export const getAllDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { locationId, donorId, dateFrom, dateTo } = req.query;

    let query = donationRepo
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.location', 'location')
      .leftJoinAndSelect('donation.donor', 'donor');

    if (locationId) {
      query = query.andWhere('donation.locationId = :locationId', { locationId });
    }

    if (donorId) {
      query = query.andWhere('donation.donorId = :donorId', { donorId });
    }

    if (dateFrom) {
      query = query.andWhere('donation.date >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      query = query.andWhere('donation.date <= :dateTo', { dateTo });
    }

    const donations = await query.getMany();
    res.json(donations);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerverhiba' });
  }
};

  
