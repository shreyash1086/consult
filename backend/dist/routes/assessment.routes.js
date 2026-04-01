import { Router } from 'express';
import prisma from '../config/db';
import { protect } from '../middleware/auth';
import { Role, SubmissionStatus } from '@prisma/client';
import { runSimulation } from '../services/simulation.service';
const router = Router();
router.get('/stats', protect([Role.CANDIDATE]), async (req, res) => {
    const userId = req.user.userId;
    const submissions = await prisma.submission.findMany({
        where: { userId, status: SubmissionStatus.EVALUATED },
        include: { evaluation: true },
    });
    const totalTime = submissions.reduce((acc, s) => acc + s.timeTaken, 0);
    const avgScore = submissions.length > 0
        ? submissions.reduce((acc, s) => acc + (s.evaluation?.totalScore || 0), 0) / submissions.length
        : 0;
    res.json({
        completedCount: submissions.length,
        avgScore: Math.round(avgScore),
        totalTime,
    });
});
router.get('/', protect([Role.CANDIDATE]), async (req, res) => {
    const scenarios = await prisma.scenario.findMany({
        where: { isPublished: true },
    });
    res.json(scenarios);
});
router.get('/:id', protect([Role.CANDIDATE]), async (req, res) => {
    const scenario = await prisma.scenario.findUnique({
        where: { id: req.params.id, isPublished: true },
        include: { questions: { orderBy: { order: 'asc' } } },
    });
    if (!scenario)
        return res.status(404).json({ message: 'Scenario not found' });
    // Hide modelAnswer and cached trajectory from candidate
    const { modelAnswer, cachedOptimalTrajectory, ...safeScenario } = scenario;
    res.json(safeScenario);
});
router.post('/:id/submit', protect([Role.CANDIDATE]), async (req, res) => {
    const { consultationText, questionAnswers, timeTaken } = req.body;
    const userId = req.user.userId;
    try {
        const submission = await prisma.submission.create({
            data: {
                userId,
                scenarioId: req.params.id,
                consultationText,
                questionAnswers,
                timeTaken,
                status: SubmissionStatus.PENDING,
            },
        });
        // Async simulation
        runSimulation(submission.id);
        res.json({ submissionId: submission.id, status: SubmissionStatus.PENDING });
    }
    catch (error) {
        res.status(500).json({ message: 'Submission failed' });
    }
});
router.get('/submissions', protect([Role.CANDIDATE]), async (req, res) => {
    const submissions = await prisma.submission.findMany({
        where: { userId: req.user.userId },
        include: { scenario: { select: { title: true, companyName: true } }, evaluation: true },
        orderBy: { submittedAt: 'desc' },
    });
    res.json(submissions);
});
router.get('/submissions/:id', protect([Role.CANDIDATE]), async (req, res) => {
    const submission = await prisma.submission.findUnique({
        where: { id: req.params.id, userId: req.user.userId },
        include: {
            scenario: true,
            evaluation: true,
            simulationRun: true
        },
    });
    if (!submission)
        return res.status(404).json({ message: 'Submission not found' });
    // Add year0KPIs for frontend convenience
    const scenario = submission.scenario;
    const year0KPIs = {
        revenue: scenario.revenue,
        grossClientMargin: scenario.grossClientMargin,
        totalHeadcount: scenario.totalHeadcount,
        numberOfClients: scenario.numberOfClients,
        numberOfEngagements: scenario.numberOfEngagements,
        clientPerformanceIndex: scenario.clientPerformanceIndex,
        collaborationIndex: scenario.collaborationIndex,
        deliveryQuality: scenario.deliveryQuality,
        innovationIndex: scenario.innovationIndex,
        employeeEngagement: scenario.employeeEngagement,
        riskScore: 0, // Default for now
    };
    // Hide modelAnswer UNLESS evaluated
    if (submission.status !== SubmissionStatus.EVALUATED) {
        const { scenario: { modelAnswer, cachedOptimalTrajectory, ...safeScenario }, ...safeSubmission } = submission;
        return res.json({
            ...safeSubmission,
            scenario: { ...safeScenario, year0KPIs }
        });
    }
    res.json({
        ...submission,
        scenario: { ...submission.scenario, year0KPIs }
    });
});
export default router;
