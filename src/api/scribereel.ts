const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8080';

export type CaptionStyleId = 'punch' | 'classic' | 'neon' | 'bold' | 'minimal';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

interface JobAcceptedResponseDto {
  jobId: string;
  statusUrl: string;
}

interface JobStatusResponseDto {
  status: JobStatus;
  downloadUrl?: string;
  text?: string;
  error?: string;
}

interface ErrorResponseDto {
  error?: string;
}

export interface FeatureLimitsDto {
  maxDurationSeconds: number;
}

export interface LimitsResponseDto {
  maxFileSizeMb: number;
  caption: FeatureLimitsDto;
  convert: FeatureLimitsDto;
  transcribe: FeatureLimitsDto;
}

const RATE_LIMIT_ERROR = 'Please wait before submitting another request.';
const POLL_INTERVAL_MS = 2000;

export async function getLimits(): Promise<LimitsResponseDto> {
  const response = await fetch(`${API_BASE_URL}/api/limits`);
  return parseJsonOrThrow<LimitsResponseDto>(response);
}

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  let data: T | ErrorResponseDto;

  try {
    data = (await response.json()) as T | ErrorResponseDto;
  } catch {
    throw new Error(!response.ok && response.status === 429 ? RATE_LIMIT_ERROR : 'Request failed');
  }

  if (!response.ok) {
    const errorData = data as ErrorResponseDto;
    const message =
      response.status === 429 ? errorData?.error || RATE_LIMIT_ERROR : errorData?.error || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

/** Submits a file to a processing endpoint, returning the accepted job's id and status URL. */
async function submitJob(endpoint: string, formData: FormData): Promise<JobAcceptedResponseDto> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  return parseJsonOrThrow<JobAcceptedResponseDto>(response);
}

/**
 * Polls a job's status endpoint until it reaches DONE or FAILED.
 * Calls onStatusChange on every poll (including PENDING/PROCESSING) so callers
 * can drive a loading indicator, without needing their own polling loop.
 */
async function pollJobUntilSettled(
  statusUrl: string,
  onStatusChange?: (status: JobStatus) => void
): Promise<JobStatusResponseDto> {
  while (true) {
    const response = await fetch(`${API_BASE_URL}${statusUrl}`);
    const data = await parseJsonOrThrow<JobStatusResponseDto>(response);

    onStatusChange?.(data.status);

    if (data.status === 'DONE') {
      return data;
    }
    if (data.status === 'FAILED') {
      throw new Error(data.error || 'Processing failed. Please try again.');
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

export async function createCaption(
  videoFile: File,
  style: CaptionStyleId,
  onStatusChange?: (status: JobStatus) => void
): Promise<string> {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('style', style);

  const { statusUrl } = await submitJob('/api/caption', formData);
  const result = await pollJobUntilSettled(statusUrl, onStatusChange);

  return `${API_BASE_URL}${result.downloadUrl}`;
}

export async function convertToMp3(
  videoFile: File,
  onStatusChange?: (status: JobStatus) => void
): Promise<string> {
  const formData = new FormData();
  formData.append('video', videoFile);

  const { statusUrl } = await submitJob('/api/convert', formData);
  const result = await pollJobUntilSettled(statusUrl, onStatusChange);

  return `${API_BASE_URL}${result.downloadUrl}`;
}

export async function transcribe(
  file: File,
  onStatusChange?: (status: JobStatus) => void
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const { statusUrl } = await submitJob('/api/transcribe', formData);
  const result = await pollJobUntilSettled(statusUrl, onStatusChange);

  return result.text ?? '';
}