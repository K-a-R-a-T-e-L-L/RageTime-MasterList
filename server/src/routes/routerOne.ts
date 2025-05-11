import { Router } from 'express';
import { getServersStatusOne } from '../controllers/serverControllerOne';

const router = Router();

router.get('/api/servers/status/1D', getServersStatusOne);

export default router; 