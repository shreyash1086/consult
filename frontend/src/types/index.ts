export enum Role {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  CANDIDATE = 'CANDIDATE',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionType {
  MCQ = 'MCQ',
  SHORT_ANSWER = 'SHORT_ANSWER',
  LONG_ANSWER = 'LONG_ANSWER',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  SIMULATING = 'SIMULATING',
  EVALUATED = 'EVALUATED',
  FAILED = 'FAILED',
}

export enum SimStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  industry: string;
  difficulty: Difficulty;
  isPublished: boolean;
  modelAnswer?: string;
  questions?: Question[];
  
  // Company identity
  companyName: string;
  companyTagline?: string;

  // Financial KPIs
  revenue: number;
  grossClientMargin: number;
  revenueGrowthYoY: number;
  marginTrend: number;

  // People KPIs
  totalHeadcount: number;
  partners: number;
  clientProfessionals: number;
  employeeTurnover: number;
  employeeEngagement: number;

  // Client KPIs
  numberOfClients: number;
  numberOfEngagements: number;
  engagementsPerClient: number;
  avgEngagementSize: number;
  avgDaysSalesOutstanding: number;
  clientRetention: number;

  // Operational KPIs
  clientPerformanceIndex: number;
  collaborationIndex: number;
  deliveryQuality: number;
  innovationIndex: number;
  eminenceScore: number;
  newCapabilitiesScore: number;

  // Context
  criticalIssues: string[];
  competitionContext?: string;
  swotAnalysis?: string;
  strategyPlanContext?: string;
  
  // Extra fields for frontend
  year0KPIs?: CompanyState;
}

export interface CompanyState {
  revenue: number;
  grossClientMargin: number;
  totalHeadcount: number;
  numberOfClients: number;
  numberOfEngagements: number;
  clientPerformanceIndex: number;
  collaborationIndex: number;
  deliveryQuality: number;
  innovationIndex: number;
  employeeEngagement: number;
  riskScore: number;
}

export interface SimulationRun {
  id: string;
  submissionId: string;
  candidateKPIs: CompanyState;
  optimalKPIs: CompanyState;
  divergencePoints: DivergencePoint[];
  outcomeScore: number;
  status: SimStatus;
  createdAt: string;
}

export interface DivergencePoint {
  stepNumber: number;
  candidateAction: string;
  optimalAction: string;
  stateAtStep: CompanyState;
  candidateOutcome: Partial<CompanyState>;
  optimalOutcome: Partial<CompanyState>;
  explanation: string;
  impactScore: number;
}

export interface Question {
  id: string;
  scenarioId: string;
  text: string;
  type: QuestionType;
  options: any;
  correctAnswer: string;
  marks: number;
  order: number;
}

export interface Submission {
  id: string;
  userId: string;
  scenarioId: string;
  consultationText: string;
  questionAnswers: Record<string, string>;
  status: SubmissionStatus;
  timeTaken: number;
  submittedAt: string;
  evaluation?: Evaluation;
  simulationRun?: SimulationRun;
  user?: User;
  scenario: Scenario;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  totalScore: number;
  consultationScore: number;
  questionScore: number;
  consultationFeedback: string;
  strengths: string[];
  improvements: string[];
  grade: string;
  semanticScore: number;
  structureScore: number;
  conceptScore: number;
  questionBreakdown: any;
  modelAnswerReveal: string;
}

