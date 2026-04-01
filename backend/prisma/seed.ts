import { PrismaClient, Difficulty, QuestionType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data — wrap in try/catch for fresh databases
  try { await prisma.simulationRun.deleteMany({}); } catch {}
  try { await prisma.evaluation.deleteMany({}); } catch {}
  try { await prisma.submission.deleteMany({}); } catch {}
  try { await prisma.question.deleteMany({}); } catch {}
  try { await prisma.scenario.deleteMany({}); } catch {}

  // Seed AX Corp Scenario
  const axCorp = await prisma.scenario.create({
    data: {
      title: 'AX-1: Reversing Strategic Drift',
      industry: 'Management Consulting',
      difficulty: Difficulty.HARD,
      companyName: 'AX Corp',
      companyTagline: 'Defining the next decade of strategy',
      description: `AX Corp, a global Tier-1 strategy firm, is facing an unprecedented internal crisis. After 15 years of double-digit growth, the firm has hit a 'Strategic Drift' phase. While the brand remains prestigious, the underlying metrics are deteriorating. 
      
Key exhibits show:
1. **Financial Pressure**: Revenue has dipped 2.4% YoY, and gross margins are eroding as the firm competes on price in 'commoditized' traditional strategy segments.
2. **Talent Hemorrhage**: Senior Directors and High-Potential Managers are leaving for specialized boutiques, citing stagnation in the firm's service offerings.
3. **Delivery Erosion**: Client performance scores have dropped to 64/100, primarily due to lack of cross-service-line collaboration.

Your task is to diagnose the root cause and propose a 3-year transformation plan that re-establishes AX as the leader in tech-enabled high-value strategy.`,
      revenue: 1200000000,
      grossClientMargin: 58.5,
      revenueGrowthYoY: -2.4,
      marginTrend: -1.2,
      totalHeadcount: 45000,
      partners: 1200,
      clientProfessionals: 38000,
      employeeTurnover: 18.2,
      employeeEngagement: 62.0,
      numberOfClients: 850,
      numberOfEngagements: 2400,
      engagementsPerClient: 2.8,
      avgEngagementSize: 1500000,
      avgDaysSalesOutstanding: 82,
      clientRetention: 88.0,
      clientPerformanceIndex: 64.0,
      collaborationIndex: 58.0,
      deliveryQuality: 72.0,
      innovationIndex: 45.0,
      eminenceScore: 68.0,
      newCapabilitiesScore: 52.0,
      criticalIssues: [
        'Deteriorating client performance index (64/100)',
        'Talent drain to boutiques (18.2% turnover)',
        'Innovation stagnation in core strategy service lines (45/100)',
        'Eroding margins due to commoditized engagement models',
        'Siloed operating model preventing multi-competency solutions'
      ],
      competitionContext: 'Top-tier competitors (MBB) have heavily invested in AI-driven delivery. Specialty boutiques are eating niche margins in Digital Transformation.',
      swotAnalysis: `**Strengths**: Legacy brand eminence, high-quality partner base.
**Weaknesses**: Slow tech adoption, siloed culture.
**Opportunities**: Expanding ESG & AI Strategy markets.
**Threats**: Boutique specialization, client insourcing of strategy teams.`,
      strategyPlanContext: 'The current 2023-2025 plan focuses on efficiency (cost cutting), which may be exacerbating the talent drain and innovation gap.',
      modelAnswer: `The primary diagnosis is a "Capabilities Gap" exacerbated by an outdated "Efficiency-First" operating model. 
      
1. **Diagnosis**: AX is stuck in a traditional strategy loop while the market has moved to "Implementation & Tech-Enabled Strategy."
2. **Strategy**: 
   - Shift from Pyramid to "Diamond" staffing model (more specialized seniors).
   - Launch "AX NEXT" - an internal incubator for AI service lines.
   - Implement "Value-Based Pricing" to decouple margin from pure headcount.
3. **Outcome**: Expect Gross Margin to rebound to 62%+ by Year 2 and Turnover to drop below 12% via specialized career paths.`,
      isPublished: true,
      questions: {
        create: [
          {
            text: 'Based on the KPI ticker, which metric represents the most immediate threat to the partnership model?',
            type: QuestionType.MCQ,
            options: [
              'Employee Turnover (18.2%)',
              'Gross Client Margin (58.5%)',
              'Revenue Growth (-2.4%)',
              'Innovation Index (45)'
            ],
            correctAnswer: 'Employee Turnover (18.2%)',
            marks: 10,
            order: 1
          },
          {
             text: 'Propose a specific change to the staffing model to address the delivery quality gap.',
             type: QuestionType.LONG_ANSWER,
             correctAnswer: 'Integrated cross-functional teams with expert-heavy directors.',
             marks: 20,
             options: [],
             order: 2
          }
        ]
      }
    }
  });

  console.log({ axCorp });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
