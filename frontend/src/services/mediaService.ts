import { apiClient } from '../shared/utils/api';

export interface MediaFile {
  id: number;
  propertyId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: MediaFile;
}

export interface MediaListResponse {
  success: boolean;
  message: string;
  data: MediaFile[];
}

export class MediaService {
  private static instance: MediaService;
  private baseUrl = '/api/v1/properties';

  private constructor() {}

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  /**
   * Upload a file for a property
   */
  async uploadFile(propertyId: number, file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = `${apiClient['baseURL']}/${propertyId}/upload`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiClient['token']}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      return response.json();
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Upload multiple files for a property
   */
  async uploadMultipleFiles(propertyId: number, files: File[]): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(propertyId, file));
    return Promise.all(uploadPromises);
  }

  /**
   * Get all media files for a property
   */
  async getPropertyMedia(propertyId: number): Promise<MediaListResponse> {
    try {
      const url = `${apiClient['baseURL']}/${propertyId}/media`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiClient['token']}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property media');
      }

      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch property media');
    }
  }

  /**
   * Delete a media file
   */
  async deleteMediaFile(propertyId: number, fileId: number): Promise<void> {
    try {
      const url = `${apiClient['baseURL']}/${propertyId}/media/${fileId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiClient['token']}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete media file');
      }
    } catch (error) {
      throw new Error('Failed to delete media file');
    }
  }

  /**
   * Download a media file
   */
  async downloadFile(fileUrl: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${apiClient['token']}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to download file');
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/avi',
      'video/mov',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file type icon
   */
  getFileTypeIcon(fileType: string): string {
    if (fileType.startsWith('image/')) {
      return 'image';
    } else if (fileType.startsWith('video/')) {
      return 'video';
    }
    return 'file';
  }

  /**
   * Check if file is an image
   */
  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Check if file is a video
   */
  isVideo(file: File): boolean {
    return file.type.startsWith('video/');
  }

  /**
   * Get file extension
   */
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Generate thumbnail URL for images
   */
  getThumbnailUrl(fileUrl: string, width: number = 300, height: number = 200): string {
    // This would typically involve a CDN or image processing service
    // For now, we'll return the original URL
    return fileUrl;
  }
}

export const mediaService = MediaService.getInstance(); 