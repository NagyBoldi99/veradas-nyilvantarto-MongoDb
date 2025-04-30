import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Donor } from '../entity/Donor';

const donorRepo = AppDataSource.getRepository(Donor);

const validateTaj = (taj: string): boolean => {
  if (!/^\d{9}$/.test(taj)) return false;

  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const multiplier = (i % 2 === 0) ? 3 : 7;
    sum += parseInt(taj[i]) * multiplier;
  }
  return sum % 10 === parseInt(taj[8]);
};

export const createDonor = async (req: Request, res: Response): Promise<void> => {
  const { name, gender, citizenship, birthPlace, birthDate, address, tajNumber } = req.body;

  if (!name || !gender || !citizenship || !birthPlace || !birthDate || !address || !tajNumber) {
    res.status(400).json({ message: 'Minden mező kitöltése kötelező.' });
    return;
  }

  if (!validateTaj(tajNumber)) {
    res.status(400).json({ message: 'Érvénytelen TAJ szám.' });
    return;
  }

  const newDonor = donorRepo.create({ name, gender, citizenship, birthPlace, birthDate, address, tajNumber });
  const savedDonor = await donorRepo.save(newDonor);

  res.status(201).json(savedDonor);
};

export const getAllDonors = async (req: Request, res: Response): Promise<void> => {
  const donors = await donorRepo.find();
  res.json(donors);
};
