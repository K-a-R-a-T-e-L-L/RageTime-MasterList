import { Router } from 'express';
import { getServersStatusTwo } from '../controllers/serverControllerTwo';

const router = Router();

router.get('/api/servers/status/7D_30D', getServersStatusTwo);

export default router; 