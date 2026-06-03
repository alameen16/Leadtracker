import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addActivity,
  updateStatus
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// All roles can view leads
router.get('/', getLeads);
router.get('/:id', getLeadById);

// All roles can create leads
router.post('/', createLead);

// All roles can update status and add activity
router.patch('/:id/status', updateStatus);
router.post('/:id/activities', addActivity);

// Only admin and manager can fully update a lead
router.put('/:id', authorize('admin', 'manager'), updateLead);

// Only admin can delete leads
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
