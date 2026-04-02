import openai from '../config/openai';
import prisma from '../config/db';
import { SubmissionStatus, QuestionType } from '@prisma/client';

interface EvaluationResult {
  semanticScore: number;
  structureScore: number;
  conceptScore: number;
  consultationScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const evaluateSubmission = async (submissionId: string) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        scenario: { include: { questions: { orderBy: { order: 'asc' } } } },
      },
    });

    if (!submission) throw new Error('Submission not found');
    console.log(`[Evaluation] Starting evaluation for submission: ${submissionId}`);

    const questionAnswers = submission.questionAnswers as Record<string, string>;
    const questionResults: Record<string, any> = {};
    let totalQuestionMarks = 0;
    let earnedQuestionMarks = 0;

    // 1. Evaluate Questions
    for (const question of submission.scenario.questions) {
      const userAnswer = questionAnswers[question.id] || '';
      let score = 0;
      let feedback = '';
      let isCorrect = false;

      if (question.type === QuestionType.MCQ) {
        isCorrect = userAnswer === question.correctAnswer;
        score = isCorrect ? 100 : 0;
        feedback = isCorrect ? 'Correct answer.' : `Incorrect. The correct answer was ${question.correctAnswer}.`;
      } else {
        // Use AI for open-ended questions
        const aiResponse = await callOpenAIForQuestion(question.text, question.correctAnswer, userAnswer);
        score = aiResponse.score;
        feedback = aiResponse.feedback;
        isCorrect = score >= 70;
      }

      questionResults[question.id] = { score, feedback, correct: isCorrect };
      totalQuestionMarks += question.marks;
      earnedQuestionMarks += (score / 100) * question.marks;
    }

    const questionScore = totalQuestionMarks > 0 ? (earnedQuestionMarks / totalQuestionMarks) * 100 : 100;
    console.log(`[Evaluation] Question scoring complete: ${questionScore.toFixed(2)}%`);

    // 2. Evaluate Consultation
    console.log(`[Evaluation] Calling OpenAI for consultation rubric...`);
    const consultationEvaluation = await callOpenAIForConsultation(
      submission.scenario.description,
      submission.scenario.modelAnswer,
      submission.consultationText
    );
    console.log(`[Evaluation] Rubric scoring complete`);

    // 3. Calculate Final Scores
    // Fetch outcome score from SimulationRun if available
    const simulationRun = await prisma.simulationRun.findUnique({
      where: { submissionId: submission.id },
    });

    const hasSimulation = simulationRun && simulationRun.status === 'COMPLETE';
    const outcomeScore = hasSimulation ? (simulationRun.outcomeScore || 0) : null;

    let totalScore = consultationEvaluation.consultationScore; // Fallback
    if (outcomeScore !== null) {
      totalScore = (consultationEvaluation.consultationScore * 0.40) + (outcomeScore * 0.60);
    }

    const grade = calculateGrade(totalScore);

    // 4. Save Evaluation
    await prisma.evaluation.upsert({
      where: { submissionId: submission.id },
      update: {
        consultationScore: consultationEvaluation.consultationScore,
        semanticScore: consultationEvaluation.semanticScore,
        structureScore: consultationEvaluation.structureScore,
        conceptScore: consultationEvaluation.conceptScore,
        consultationFeedback: consultationEvaluation.feedback,
        questionScore: questionScore,
        questionBreakdown: questionResults,
        totalScore,
        grade,
        strengths: consultationEvaluation.strengths,
        improvements: consultationEvaluation.improvements,
        modelAnswerReveal: submission.scenario.modelAnswer,
      },
      create: {
        submissionId: submission.id,
        consultationScore: consultationEvaluation.consultationScore,
        semanticScore: consultationEvaluation.semanticScore,
        structureScore: consultationEvaluation.structureScore,
        conceptScore: consultationEvaluation.conceptScore,
        consultationFeedback: consultationEvaluation.feedback,
        questionScore: questionScore,
        questionBreakdown: questionResults,
        totalScore,
        grade,
        strengths: consultationEvaluation.strengths,
        improvements: consultationEvaluation.improvements,
        modelAnswerReveal: submission.scenario.modelAnswer,
      },
    });

    // 5. Update Submission Status
    await prisma.submission.update({
      where: { id: submission.id },
      data: { 
        status: SubmissionStatus.EVALUATED 
      },
    });

    console.log(`[Evaluation] Submission status updated to EVALUATED for ${submissionId}`);
    console.log(`[Evaluation] SUCCESS: Full pipeline complete.`);
  } catch (error) {
    console.error('Evaluation Service Error:', error);
    // Mark as failed or retry? For now just log.
  }
};

const callOpenAIForQuestion = async (question: string, modelAnswer: string, userAnswer: string) => {
  const prompt = `
    Evaluate the candidate's answer to the following question against the model answer.
    Question: ${question}
    Model Answer: ${modelAnswer}
    Candidate Answer: ${userAnswer}

    Provide a score (0-100) and brief feedback (1 sentence).
    Return JSON: { "score": number, "feedback": string }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error: any) {
    console.error('OpenAI Question Error:', error);
    return { score: 0, feedback: 'Error evaluating answer.' };
  }
};

const callOpenAIForConsultation = async (scenario: string, modelAnswer: string, consultationText: string): Promise<EvaluationResult> => {
  const prompt = `
    You are an expert business consultant evaluator. 
    Evaluate the candidate's consultation response for the given scenario.

    Scenario: ${scenario}
    Model Answer: ${modelAnswer}
    Candidate Answer: ${consultationText}

    Score on THREE dimensions, each 0-100:

    1. SEMANTIC SIMILARITY (weight: 35%)
    Compare the candidate's answer to the model answer. 
    How well does it cover the same ground, conclusions, and recommendations?
    Score 0 = completely off-topic, 100 = near-identical substance.

    2. STRUCTURAL QUALITY (weight: 30%)
    Does the answer have: clear problem identification, structured analysis, 
    logical recommendations, and conclusion? 
    Score 0 = rambling, 100 = perfectly structured MECE-style consulting answer.

    3. CONCEPT COVERAGE (weight: 35%)
    Does the answer demonstrate correct use of relevant business frameworks, 
    domain knowledge, and consulting best practices?
    Score 0 = no concepts, 100 = comprehensive frameworks correctly applied.

    Return ONLY valid JSON with this exact shape:
    {
      "semanticScore": number,
      "structureScore": number,  
      "conceptScore": number,
      "consultationScore": number,  // weighted average of above three
      "feedback": string,           // 3-4 sentence narrative feedback
      "strengths": string[],        // 2-3 specific strengths identified
      "improvements": string[]      // 2-3 specific areas to improve
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error: any) {
    console.error('OpenAI Consultation Error:', error);
    return {
      semanticScore: 0,
      structureScore: 0,
      conceptScore: 0,
      consultationScore: 0,
      feedback: 'Error evaluating consultation.',
      strengths: [],
      improvements: [],
    };
  }
};

const calculateGrade = (score: number) => {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 45) return 'D';
  return 'F';
};
