import { Router } from 'express';
import { getAllLocations, createLocation, toggleActive } from '../controller/location.controller';
import { authenticateToken } from '../middleware/auth.middleware';
const router = Router();

router.get('/', getAllLocations);
router.post('/',authenticateToken, createLocation);
router.patch('/:id/toggle',authenticateToken ,toggleActive);

export default router;
