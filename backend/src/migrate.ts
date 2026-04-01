/**
 * Manual migration script — runs raw SQL via pg Pool
 * which uses the same connection method as the backend server.
 * Run with: npx tsx src/migrate.ts
 */
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrations = [
  // ── Enums ──────────────────────────────────────────────────────────────
  `DO $$ BEGIN
    CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING','SIMULATING','EVALUATED','FAILED');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,

  `DO $$ BEGIN
    CREATE TYPE "SimStatus" AS ENUM ('PENDING','RUNNING','COMPLETE','FAILED');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,

  // Add SIMULATING/FAILED to SubmissionStatus if missing
  `DO $$ BEGIN
    ALTER TYPE "SubmissionStatus" ADD VALUE IF NOT EXISTS 'SIMULATING';
  EXCEPTION WHEN others THEN NULL; END $$;`,
  `DO $$ BEGIN
    ALTER TYPE "SubmissionStatus" ADD VALUE IF NOT EXISTS 'FAILED';
  EXCEPTION WHEN others THEN NULL; END $$;`,

  // ── Scenario — company identity ─────────────────────────────────────────
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "companyName" TEXT NOT NULL DEFAULT 'AX Corp';`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "companyTagline" TEXT;`,

  // ── Scenario — financial KPIs ───────────────────────────────────────────
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "revenue" DOUBLE PRECISION NOT NULL DEFAULT 1200000000;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "grossClientMargin" DOUBLE PRECISION NOT NULL DEFAULT 58.5;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "revenueGrowthYoY" DOUBLE PRECISION NOT NULL DEFAULT -2.4;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "marginTrend" DOUBLE PRECISION NOT NULL DEFAULT -1.2;`,

  // ── Scenario — people KPIs ──────────────────────────────────────────────
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "totalHeadcount" INTEGER NOT NULL DEFAULT 45000;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "partners" INTEGER NOT NULL DEFAULT 1200;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "clientProfessionals" INTEGER NOT NULL DEFAULT 38000;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "employeeTurnover" DOUBLE PRECISION NOT NULL DEFAULT 18.2;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "employeeEngagement" DOUBLE PRECISION NOT NULL DEFAULT 62.0;`,

  // ── Scenario — client KPIs ──────────────────────────────────────────────
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "numberOfClients" INTEGER NOT NULL DEFAULT 850;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "numberOfEngagements" INTEGER NOT NULL DEFAULT 2400;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "engagementsPerClient" DOUBLE PRECISION NOT NULL DEFAULT 2.8;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "avgEngagementSize" DOUBLE PRECISION NOT NULL DEFAULT 1500000;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "avgDaysSalesOutstanding" INTEGER NOT NULL DEFAULT 82;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "clientRetention" DOUBLE PRECISION NOT NULL DEFAULT 88.0;`,

  // ── Scenario — operational KPIs ─────────────────────────────────────────
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "clientPerformanceIndex" DOUBLE PRECISION NOT NULL DEFAULT 64.0;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "collaborationIndex" DOUBLE PRECISION NOT NULL DEFAULT 58.0;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "deliveryQuality" DOUBLE PRECISION NOT NULL DEFAULT 72.0;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "innovationIndex" DOUBLE PRECISION NOT NULL DEFAULT 45.0;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "eminenceScore" DOUBLE PRECISION NOT NULL DEFAULT 68.0;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "newCapabilitiesScore" DOUBLE PRECISION NOT NULL DEFAULT 52.0;`,

  // ── Scenario — context fields ───────────────────────────────────────────
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "criticalIssues" TEXT[] NOT NULL DEFAULT '{}';`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "competitionContext" TEXT;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "swotAnalysis" TEXT;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "strategyPlanContext" TEXT;`,
  `ALTER TABLE "Scenario" ADD COLUMN IF NOT EXISTS "cachedOptimalTrajectory" JSONB;`,

  // ── Submission — status column ──────────────────────────────────────────
  `ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING';`,
  `ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "timeTaken" INTEGER NOT NULL DEFAULT 0;`,

  // ── SimulationRun table ─────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS "SimulationRun" (
    "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "submissionId"     TEXT NOT NULL UNIQUE,
    "candidateKPIs"    JSONB NOT NULL,
    "optimalKPIs"      JSONB NOT NULL,
    "divergencePoints" JSONB NOT NULL,
    "outcomeScore"     DOUBLE PRECISION,
    "status"           "SimStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SimulationRun_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SimulationRun_submissionId_fkey"
      FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );`,

  // ── Evaluation — extra fields ───────────────────────────────────────────
  `ALTER TABLE "Evaluation" ADD COLUMN IF NOT EXISTS "semanticScore" DOUBLE PRECISION NOT NULL DEFAULT 0;`,
  `ALTER TABLE "Evaluation" ADD COLUMN IF NOT EXISTS "structureScore" DOUBLE PRECISION NOT NULL DEFAULT 0;`,
  `ALTER TABLE "Evaluation" ADD COLUMN IF NOT EXISTS "conceptScore"   DOUBLE PRECISION NOT NULL DEFAULT 0;`,
  `ALTER TABLE "Evaluation" ADD COLUMN IF NOT EXISTS "strengths"      TEXT[] NOT NULL DEFAULT '{}';`,
  `ALTER TABLE "Evaluation" ADD COLUMN IF NOT EXISTS "improvements"   TEXT[] NOT NULL DEFAULT '{}';`,
  `ALTER TABLE "Evaluation" ADD COLUMN IF NOT EXISTS "modelAnswerReveal" TEXT NOT NULL DEFAULT '';`,
];

async function run() {
  const client = await pool.connect();
  console.log('✅ Connected to database');
  try {
    for (const sql of migrations) {
      const preview = sql.replace(/\s+/g, ' ').trim().substring(0, 80);
      process.stdout.write(`  → ${preview}…`);
      await client.query(sql);
      console.log(' ✓');
    }
    console.log('\n🎉 Migration complete! All columns and tables are in sync.');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
