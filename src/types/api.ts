export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  url: string;
  size: number;
  type: string;
  name: string;
}

export interface FileUploadRequest {
  file: File;
  type?: 'image' | 'document' | 'resume';
}

export interface StorageQuota {
  used: number;
  limit: number;
  available: number;
}
