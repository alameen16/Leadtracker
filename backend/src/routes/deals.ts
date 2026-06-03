import { Router } from 'express';
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal
} from '../controllers/dealController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// All roles can view deals
router.get('/', getDeals);
router.get('/:id', getDealById);

// All roles can create deals
router.post('/', createDeal);

// Only admin and manager can update deals
router.put('/:id', authorize('admin', 'manager'), updateDeal);

// Only admin can delete deals
router.delete('/:id', authorize('admin'), deleteDeal);

export default router;
