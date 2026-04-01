import { Router } from 'express';
import * as authService from '../services/auth.service';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/login', authService.login);
router.post('/refresh', authService.refresh);
router.post('/logout', authService.logout);
router.get('/me', protect(), authService.getMe);

export default router;
