import { Router } from 'express';
import prisma from '../config/db';
import { protect } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/submissions', protect([Role.TRAINER, Role.ADMIN]), async (req, res) => {
  const submissions = await prisma.submission.findMany({
    include: { user: { select: { name: true } }, scenario: { select: { title: true } }, evaluation: true },
    orderBy: { submittedAt: 'desc' },
  });
  res.json(submissions);
});

router.get('/submissions/:id', protect([Role.TRAINER, Role.ADMIN]), async (req, res) => {
  const submission = await prisma.submission.findUnique({
    where: { id: req.params.id as string },
    include: { user: { select: { name: true, email: true } }, scenario: true, evaluation: true },
  });
  res.json(submission);
});

router.get('/analytics', protect([Role.TRAINER]), async (req, res) => {
  const submissionsCount = await prisma.submission.count();
  const avgScore = await prisma.evaluation.aggregate({ _avg: { totalScore: true } });
  
  res.json({
    totalEvaluated: submissionsCount,
    averagePlatformScore: avgScore._avg.totalScore || 0,
  });
});

export default router;
