import { Response } from 'express';
import Deal from '../models/Deal';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getDeals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { stage } = req.query;
    const filter: any = {};
    if (stage) filter.stage = stage;

    const deals = await Deal.find(filter)
      .populate('assignedTo', 'name email')
      .populate('leadId', 'fullName email')
      .sort({ createdAt: -1 });

    sendSuccess(res, deals);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getDealById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('leadId', 'fullName email status');

    if (!deal) {
      sendError(res, 'Deal not found', 404);
      return;
    }
    sendSuccess(res, deal);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const createDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.create({ ...req.body, createdBy: req.user?.userId });
    sendSuccess(res, deal, 'Deal created', 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) {
      sendError(res, 'Deal not found', 404);
      return;
    }
    sendSuccess(res, deal, 'Deal updated');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteDeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) {
      sendError(res, 'Deal not found', 404);
      return;
    }
    sendSuccess(res, null, 'Deal deleted');
  } catch (error: any) {
    sendError(res, error.message);
  }
};
