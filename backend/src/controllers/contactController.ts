import { Response } from 'express';
import Contact from '../models/Contact';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const contacts = await Contact.find(filter)
      .populate('linkedLeads', 'fullName status')
      .sort({ createdAt: -1 });

    sendSuccess(res, contacts);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getContactById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id).populate('linkedLeads');
    if (!contact) {
      sendError(res, 'Contact not found', 404);
      return;
    }
    sendSuccess(res, contact);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const createContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.create({ ...req.body, createdBy: req.user?.userId });
    sendSuccess(res, contact, 'Contact created', 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!contact) {
      sendError(res, 'Contact not found', 404);
      return;
    }
    sendSuccess(res, contact, 'Contact updated');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      sendError(res, 'Contact not found', 404);
      return;
    }
    sendSuccess(res, null, 'Contact deleted');
  } catch (error: any) {
    sendError(res, error.message);
  }
};
