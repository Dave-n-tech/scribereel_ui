
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8080';

export type CaptionStyleId = 'punch' | 'classic' | 'neon' | 'bold' | 'minimal';

interface CaptionResponseDto {
  downloadUrl: string;
}

interface TranscriptionResponseDto {
  text: string;
}

interface ErrorResponseDto {
  error?: string;
}

const RATE_LIMIT_ERROR = 'Please wait before submitting another request.';

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  let data: T | ErrorResponseDto;

  try {
    data = (await response.json()) as T | ErrorResponseDto;
  } catch {
    throw new Error(!response.ok && response.status === 429 ? RATE_LIMIT_ERROR : 'Request failed');
  }

  if (!response.ok) {
    const errorData = data as ErrorResponseDto;
    const message = response.status === 429
      ? errorData?.error || RATE_LIMIT_ERROR
      : errorData?.error || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export async function createCaption(
  videoFile: File,
  style: CaptionStyleId
): Promise<string> {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('style', style);

  const response = await fetch(`${API_BASE_URL}/api/caption`, {
    method: 'POST',
    body: formData,
  });

  const data = await parseJsonOrThrow<CaptionResponseDto>(response);
  return `${API_BASE_URL}${data.downloadUrl}`;
}

export async function convertToMp3(videoFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('video', videoFile);

  const response = await fetch(`${API_BASE_URL}/api/convert`, {
    method: 'POST',
    body: formData,
  });

  const data = await parseJsonOrThrow<CaptionResponseDto>(response);
  return `${API_BASE_URL}${data.downloadUrl}`;
}

export async function transcribe(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });

  const data = await parseJsonOrThrow<TranscriptionResponseDto>(response);
  return data.text;
}