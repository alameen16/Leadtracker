import { Router } from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// All roles can view contacts
router.get('/', getContacts);
router.get('/:id', getContactById);

// All roles can create contacts
router.post('/', createContact);

// Only admin and manager can update contacts
router.put('/:id', authorize('admin', 'manager'), updateContact);

// Only admin can delete contacts
router.delete('/:id', authorize('admin'), deleteContact);

export default router;
