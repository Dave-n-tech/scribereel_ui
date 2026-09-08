
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_LOCAL || 'http://localhost:8080';

export type CaptionStyleId = 'punch' | 'classic' | 'neon' | 'bold' | 'minimal';

interface CaptionResponseDto {
  downloadUrl: string;
}

interface TranscriptionResponseDto {
  text: string;
}

interface ErrorResponseDto {
  error: string;
}

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | ErrorResponseDto;

  if (!response.ok) {
    const errorData = data as ErrorResponseDto;
    throw new Error(errorData.error || 'Request failed');
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