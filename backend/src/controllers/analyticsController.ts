import { Response } from 'express';
import Lead from '../models/Lead';
import Deal from '../models/Deal';
import Contact from '../models/Contact';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalLeads, totalContacts, totalDeals, totalUsers] = await Promise.all([
      Lead.countDocuments(),
      Contact.countDocuments(),
      Deal.countDocuments(),
      User.countDocuments(),
    ]);

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const leadsBySource = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    const wonDeals = await Deal.find({ stage: 'Won' });
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

    const pipelineValue = await Deal.aggregate([
      { $match: { stage: { $nin: ['Won', 'Lost'] } } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);

    sendSuccess(res, {
      totalLeads,
      totalContacts,
      totalDeals,
      totalUsers,
      totalRevenue,
      pipelineValue: pipelineValue[0]?.total || 0,
      leadsByStatus,
      leadsBySource,
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getPipelineAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pipeline = await Deal.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 }, totalValue: { $sum: '$value' } } },
      { $sort: { _id: 1 } }
    ]);

    sendSuccess(res, pipeline);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getTeamPerformance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const performance = await Lead.aggregate([
      { $match: { assignedTo: { $exists: true } } },
      { $group: { _id: '$assignedTo', totalLeads: { $sum: 1 }, wonLeads: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', email: '$user.email', totalLeads: 1, wonLeads: 1 } }
    ]);

    sendSuccess(res, performance);
  } catch (error: any) {
    sendError(res, error.message);
  }
};
