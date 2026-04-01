import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Submission, SubmissionStatus } from '../types';

export const useSubmissionPoll = (submissionId: string | null) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!submissionId) return;

    let intervalId: any;

    const poll = async (isFirst = false) => {
      if (isFirst) setLoading(true);
      try {
        const { data } = await api.get(`/assessments/submissions/${submissionId}`);
        setSubmission(data);
        
        if (data.status === SubmissionStatus.EVALUATED || data.status === SubmissionStatus.FAILED) {
          clearInterval(intervalId);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to poll submission');
        clearInterval(intervalId);
      } finally {
        if (isFirst) setLoading(false);
      }
    };

    poll(true);
    intervalId = setInterval(() => poll(false), 3000);

    return () => clearInterval(intervalId);
  }, [submissionId]);

  return { submission, loading, error };
};
