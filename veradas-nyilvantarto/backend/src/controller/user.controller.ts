// src/controller/user.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(User);
const JWT_SECRET = 'titkoskulcs'; // élesben .env-ből jöjjön

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Hiányzó adatok' });
    return;
  }

  const existingUser = await userRepo.findOneBy({ username });
  if (existingUser) {
    res.status(400).json({ message: 'A felhasználónév már foglalt' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = userRepo.create({ username, password: hashedPassword });
  await userRepo.save(newUser);

  res.status(201).json({ message: 'Sikeres regisztráció' });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = await userRepo.findOneBy({ username });
  if (!user) {
    res.status(400).json({ message: 'Hibás bejelentkezési adatok' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(400).json({ message: 'Hibás jelszó' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
