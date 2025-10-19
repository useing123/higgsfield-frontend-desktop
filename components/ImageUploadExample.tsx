'use client';

import { useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';

export function ImageUploadExample() {
  const { uploadImage, isUploading, error, progress } = useImageUpload();
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadImage(file);
      setImageUrl(publicUrl);
      console.log('Image uploaded successfully:', publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
          Upload Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
        />
      </div>

      {isUploading && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Uploading... {progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          Error: {error}
        </div>
      )}

      {imageUrl && (
        <div className="space-y-2">
          <p className="text-sm text-green-600">Upload successful!</p>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="max-w-md rounded-lg shadow-md"
          />
          <p className="text-xs text-gray-500 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}
