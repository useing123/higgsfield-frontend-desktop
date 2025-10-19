import { useState, useEffect, useRef, useCallback } from 'react';
import { JobDetails } from '@/lib/types';
import { apiService } from '@/services/apiService';

interface JobPollingConfig {
  jobSetId: string;
  initialStatus: string;
  onStatusChange?: (status: string) => void;
  onError?: (error: Error) => void;
  onComplete?: (job: JobDetails & { result_url?: string }) => void;
}

interface JobPollingResult {
  job: JobDetails & { result_url?: string };
  progress: number;
  estimatedTime: number;
  isPolling: boolean;
  error: Error | null;
  retryCount: number;
}

const INITIAL_POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLL_INTERVAL = 15000; // 15 seconds
const MAX_POLL_ATTEMPTS = 180; // ~15 minutes at 5s intervals
const BACKOFF_MULTIPLIER = 1.2;
const ESTIMATED_TOTAL_TIME = 120; // 2 minutes in seconds

/**
 * Production-ready job polling hook with robust error handling and cleanup
 *
 * Features:
 * - AbortController for cancelling in-flight requests
 * - Exponential backoff on errors
 * - Maximum attempt limits
 * - Race condition prevention via sequence IDs
 * - Ref-based interval management
 * - Smart progress calculation
 * - Automatic cleanup on unmount
 */
export function useJobPolling(config: JobPollingConfig): JobPollingResult {
  const { jobSetId, initialStatus, onStatusChange, onError, onComplete } = config;

  const [job, setJob] = useState<JobDetails & { result_url?: string }>({
    job_set_id: jobSetId,
    status: initialStatus as JobDetails['status'],
    jobs: [],
  });

  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(ESTIMATED_TOTAL_TIME);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs to prevent stale closures and manage polling lifecycle
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollAttemptRef = useRef(0);
  const currentIntervalRef = useRef(INITIAL_POLL_INTERVAL);
  const requestSequenceRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const consecutiveErrorsRef = useRef(0);
  const hasCompletedRef = useRef(false);

  // Check if job is in a terminal state
  const isTerminalStatus = (status: string): boolean => {
    return status === 'completed' || status === 'succeeded' || status === 'failed';
  };

  // Calculate smart progress based on elapsed time and poll count
  const calculateProgress = useCallback((elapsedSeconds: number, pollCount: number): number => {
    // Combine time-based and poll-based progress for smoother UX
    const timeBasedProgress = Math.min((elapsedSeconds / ESTIMATED_TOTAL_TIME) * 100, 90);
    const pollBasedProgress = Math.min(pollCount * 5, 90); // 5% per poll, max 90%

    // Weight time-based progress more heavily initially, then shift to poll-based
    const weight = Math.min(elapsedSeconds / 30, 1); // Transition over 30 seconds
    const combinedProgress = (timeBasedProgress * (1 - weight)) + (pollBasedProgress * weight);

    return Math.min(Math.round(combinedProgress), 95);
  }, []);

  // Update estimated time remaining
  const updateEstimatedTime = useCallback((elapsedSeconds: number): void => {
    const remaining = Math.max(ESTIMATED_TOTAL_TIME - elapsedSeconds, 5);
    setEstimatedTime(remaining);
  }, []);

  // Cleanup function to clear all polling resources
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Poll job status with proper error handling and abort support
  const pollJobStatus = useCallback(async () => {
    // Don't poll if already completed
    if (hasCompletedRef.current) {
      cleanup();
      return;
    }

    // Check max attempts
    if (pollAttemptRef.current >= MAX_POLL_ATTEMPTS) {
      const maxAttemptsError = new Error('Max polling attempts reached. Job may be stuck.');
      setError(maxAttemptsError);
      onError?.(maxAttemptsError);
      cleanup();
      return;
    }

    pollAttemptRef.current += 1;
    const currentSequence = ++requestSequenceRef.current;

    // Update progress and time based on elapsed time
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setProgress(calculateProgress(elapsedSeconds, pollAttemptRef.current));
    updateEstimatedTime(elapsedSeconds);

    try {
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      // Fetch job status with abort signal
      const updatedJob = await apiService.getJobStatus(jobSetId);

      // Ignore response if it's from an old request (race condition prevention)
      if (currentSequence !== requestSequenceRef.current) {
        return;
      }

      if (updatedJob && updatedJob.jobs && updatedJob.jobs.length > 0) {
        const mainJob = updatedJob.jobs[0];
        const newStatus = mainJob.status;
        const newResultUrl = mainJob.results?.raw?.url || mainJob.results?.min?.url;

        const updatedJobData: JobDetails & { result_url?: string } = {
          ...updatedJob,
          status: newStatus,
          result_url: newResultUrl,
        };

        setJob(updatedJobData);

        // Notify status change
        if (newStatus !== job.status) {
          onStatusChange?.(newStatus);
        }

        // Handle completion
        if (isTerminalStatus(newStatus)) {
          hasCompletedRef.current = true;
          setProgress(100);
          setEstimatedTime(0);
          cleanup();

          if (newStatus === 'completed' || newStatus === 'succeeded') {
            onComplete?.(updatedJobData);
          } else if (newStatus === 'failed') {
            const failedError = new Error('Job generation failed');
            setError(failedError);
            onError?.(failedError);
          }
        }

        // Reset error count on success
        consecutiveErrorsRef.current = 0;
        currentIntervalRef.current = INITIAL_POLL_INTERVAL;
      }
    } catch (err) {
      // Ignore abort errors (expected on cleanup)
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      consecutiveErrorsRef.current += 1;
      setRetryCount(consecutiveErrorsRef.current);

      const pollError = err instanceof Error ? err : new Error('Failed to poll job status');
      console.error('Job polling error:', pollError);

      // Only set error state after multiple consecutive failures
      if (consecutiveErrorsRef.current >= 3) {
        setError(pollError);
        onError?.(pollError);
      }

      // Apply exponential backoff on errors
      currentIntervalRef.current = Math.min(
        currentIntervalRef.current * BACKOFF_MULTIPLIER,
        MAX_POLL_INTERVAL
      );

      // Stop polling after too many consecutive errors
      if (consecutiveErrorsRef.current >= 10) {
        cleanup();
      }
    }
  }, [
    jobSetId,
    job.status,
    cleanup,
    calculateProgress,
    updateEstimatedTime,
    onStatusChange,
    onComplete,
    onError,
  ]);

  // Start polling when component mounts or jobSetId changes
  useEffect(() => {
    // Don't start polling if already in terminal state
    if (isTerminalStatus(initialStatus)) {
      setProgress(100);
      setEstimatedTime(0);
      hasCompletedRef.current = true;
      return;
    }

    // Reset state
    startTimeRef.current = Date.now();
    pollAttemptRef.current = 0;
    requestSequenceRef.current = 0;
    consecutiveErrorsRef.current = 0;
    currentIntervalRef.current = INITIAL_POLL_INTERVAL;
    hasCompletedRef.current = false;
    setIsPolling(true);
    setError(null);
    setRetryCount(0);

    // Start polling immediately
    pollJobStatus();

    // Set up interval for subsequent polls
    intervalRef.current = setInterval(() => {
      pollJobStatus();
    }, currentIntervalRef.current);

    // Cleanup on unmount or when dependencies change
    return () => {
      cleanup();
    };
  }, [jobSetId, initialStatus]); // Only re-run if jobSetId changes

  return {
    job,
    progress,
    estimatedTime,
    isPolling,
    error,
    retryCount,
  };
}
