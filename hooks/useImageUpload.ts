import { useState } from 'react';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

const BUCKET_NAME = 'dukenapp-user-images';

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${file.name}`;

      // Direct upload to public GCS bucket
      const uploadUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${uniqueFilename}`;

      setProgress(25);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      setProgress(100);
      setIsUploading(false);

      // Return the public URL
      return uploadUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setIsUploading(false);
      setProgress(0);
      throw err;
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
    progress,
  };
}
