export interface UploadResult {
  url: string;
  size: number;
  type: string;
  name: string;
}

export interface StorageConfig {
  maxFileSize: number;
  allowedTypes: string[];
}

export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

export function validateFile(file: File, config: StorageConfig = DEFAULT_STORAGE_CONFIG): { valid: boolean; error?: string } {
  if (file.size > config.maxFileSize) {
    return { valid: false, error: 'File size exceeds limit' };
  }

  if (!config.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
}
