import { Router } from 'express';
import { getSummary, getPipelineAnalytics, getTeamPerformance } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// All roles can see summary and pipeline
router.get('/summary', getSummary);
router.get('/pipeline', getPipelineAnalytics);

// Only admin and manager can see team performance
router.get('/team', authorize('admin', 'manager'), getTeamPerformance);

export default router;
