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
export interface Action {
    actionId: number;
    description: string;
    category: 'COST_REDUCTION' | 'REVENUE_GROWTH' | 'OPERATIONAL' | 'PEOPLE' | 'RISK';
    magnitude: 'LOW' | 'MEDIUM' | 'HIGH';
    timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
    rationale?: string;
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
export declare const runSimulation: (submissionId: string) => Promise<void>;
