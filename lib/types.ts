export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  job_details?: JobDetails;
};

export type JobDetails = {
  job_set_id: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'completed';
  result_url?: string;
  jobs: {
    result?: {
      url?: string;
    };
  }[];
};