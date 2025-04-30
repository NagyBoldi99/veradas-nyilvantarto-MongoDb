import { Router } from 'express';
import { createDonation ,getAllDonations} from '../controller/donation.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/',authenticateToken, createDonation);
router.get('/', getAllDonations);

export default router;
