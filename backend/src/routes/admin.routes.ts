import { Router } from 'express';
import prisma from '../config/db';
import { protect } from '../middleware/auth';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();

router.get('/scenarios', protect([Role.ADMIN]), async (req, res) => {
  const scenarios = await prisma.scenario.findMany({
    include: { questions: true }
  });
  res.json(scenarios);
});

router.get('/scenarios/:id', protect([Role.ADMIN]), async (req, res) => {
  const scenario = await prisma.scenario.findUnique({
    where: { id: req.params.id as string },
    include: { questions: true }
  });
  res.json(scenario);
});

router.get('/scenarios/:id/simulation-status', protect([Role.ADMIN]), async (req, res) => {
  const submission = await prisma.submission.findFirst({
    where: { scenarioId: req.params.id as string },
    orderBy: { submittedAt: 'desc' },
    include: { simulationRun: true }
  });
  res.json({
    status: submission?.simulationRun?.status || 'NONE',
    lastRunAt: submission?.simulationRun?.createdAt
  });
});

router.post('/scenarios', protect([Role.ADMIN]), async (req, res) => {
  const { 
    title, description, industry, difficulty, modelAnswer, isPublished,
    companyName, companyTagline, revenue, grossClientMargin, revenueGrowthYoY, marginTrend,
    totalHeadcount, partners, clientProfessionals, employeeTurnover, employeeEngagement,
    numberOfClients, numberOfEngagements, engagementsPerClient, avgEngagementSize, avgDaysSalesOutstanding, clientRetention,
    clientPerformanceIndex, collaborationIndex, deliveryQuality, innovationIndex, eminenceScore, newCapabilitiesScore,
    criticalIssues, competitionContext, swotAnalysis, strategyPlanContext
  } = req.body;

  const scenario = await prisma.scenario.create({
    data: { 
      title: title as string, 
      description: description as string, 
      industry: industry as string, 
      difficulty: difficulty as any, 
      modelAnswer: modelAnswer as string,
      isPublished: !!isPublished,
      companyName, companyTagline, revenue, grossClientMargin, revenueGrowthYoY, marginTrend,
      totalHeadcount, partners, clientProfessionals, employeeTurnover, employeeEngagement,
      numberOfClients, numberOfEngagements, engagementsPerClient, avgEngagementSize, avgDaysSalesOutstanding, clientRetention,
      clientPerformanceIndex, collaborationIndex, deliveryQuality, innovationIndex, eminenceScore, newCapabilitiesScore,
      criticalIssues, competitionContext, swotAnalysis, strategyPlanContext
    },
  });
  res.json(scenario);
});

router.put('/scenarios/:id', protect([Role.ADMIN]), async (req, res) => {
  const { 
    title, description, industry, difficulty, modelAnswer, isPublished,
    companyName, companyTagline, revenue, grossClientMargin, revenueGrowthYoY, marginTrend,
    totalHeadcount, partners, clientProfessionals, employeeTurnover, employeeEngagement,
    numberOfClients, numberOfEngagements, engagementsPerClient, avgEngagementSize, avgDaysSalesOutstanding, clientRetention,
    clientPerformanceIndex, collaborationIndex, deliveryQuality, innovationIndex, eminenceScore, newCapabilitiesScore,
    criticalIssues, competitionContext, swotAnalysis, strategyPlanContext
  } = req.body;

  const scenario = await prisma.scenario.update({
    where: { id: req.params.id as string },
    data: { 
      title: title as string | undefined, 
      description: description as string | undefined, 
      industry: industry as string | undefined, 
      difficulty: difficulty as any, 
      modelAnswer: modelAnswer as string | undefined, 
      isPublished: isPublished as boolean | undefined,
      companyName, companyTagline, revenue, grossClientMargin, revenueGrowthYoY, marginTrend,
      totalHeadcount, partners, clientProfessionals, employeeTurnover, employeeEngagement,
      numberOfClients, numberOfEngagements, engagementsPerClient, avgEngagementSize, avgDaysSalesOutstanding, clientRetention,
      clientPerformanceIndex, collaborationIndex, deliveryQuality, innovationIndex, eminenceScore, newCapabilitiesScore,
      criticalIssues, competitionContext, swotAnalysis, strategyPlanContext
    },
  });
  res.json(scenario);
});


router.delete('/scenarios/:id', protect([Role.ADMIN]), async (req, res) => {
  await prisma.scenario.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Scenario deleted' });
});

// Question Management
router.post('/scenarios/:id/questions', protect([Role.ADMIN]), async (req, res) => {
  const { text, type, options, correctAnswer, marks, order } = req.body;
  const question = await prisma.question.create({
    data: { 
      scenarioId: req.params.id as string, 
      text: text as string, 
      type: type as any, 
      options: options as any, 
      correctAnswer: correctAnswer as string, 
      marks: marks as number, 
      order: order as number 
    },
  });
  res.json(question);
});

router.put('/questions/:id', protect([Role.ADMIN]), async (req, res) => {
  const question = await prisma.question.update({
    where: { id: req.params.id as string },
    data: req.body as any,
  });
  res.json(question);
});
router.get('/scenarios/:id/questions', protect([Role.ADMIN]), async (req, res) => {
  const questions = await prisma.question.findMany({
    where: { scenarioId: req.params.id as string },
    orderBy: { order: 'asc' }
  });
  res.json(questions);
});

router.delete('/questions/:id', protect([Role.ADMIN]), async (req, res) => {
  await prisma.question.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Question deleted' });
});

// User Management
router.get('/users', protect([Role.ADMIN]), async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
  res.json(users);
});

router.post('/users', protect([Role.ADMIN]), async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

// Platform Stats
router.get('/analytics/overview', protect([Role.ADMIN]), async (req, res) => {
  const totalCandidates = await prisma.user.count({ where: { role: Role.CANDIDATE } });
  const totalSubmissions = await prisma.submission.count();
  const avgScore = await prisma.evaluation.aggregate({ _avg: { totalScore: true } });

  res.json({
    totalCandidates,
    totalSubmissions,
    platformAvgScore: avgScore._avg.totalScore || 0,
  });
});

export default router;
