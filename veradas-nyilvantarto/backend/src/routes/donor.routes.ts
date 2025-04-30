import { Router } from 'express';
import { createDonor, getAllDonors } from '../controller/donor.controller';
import { authenticateToken } from '../middleware/auth.middleware';
const router = Router();

router.post('/',authenticateToken, createDonor); // Új véradó rögzítése
router.get('/', getAllDonors); // Véradók listázása

export default router;
