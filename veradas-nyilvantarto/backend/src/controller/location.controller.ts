import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Location } from '../entity/Location';

const locationRepo = AppDataSource.getRepository(Location);

export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
  const locations = await locationRepo.find();
  res.json(locations);
};

export const createLocation = async (req: Request, res: Response): Promise<void> => {
  const { name, address } = req.body;
  if (!name || !address) {
    res.status(400).json({ message: 'Név és cím kötelező' });
    return;
  }

  const newLoc = locationRepo.create({ name, address });
  const saved = await locationRepo.save(newLoc);
  res.status(201).json(saved);
};

export const toggleActive = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const location = await locationRepo.findOneBy({ id });

  if (!location) {
    res.status(404).json({ message: 'Helyszín nem található' });
    return;
  }

  location.active = !location.active;
  await locationRepo.save(location);
  res.json(location);
};
