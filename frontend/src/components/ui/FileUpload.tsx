import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image,
  VideoFile,
  InsertDriveFile,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  uploadProgress?: number;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFileRemove,
  acceptedFileTypes = ['image/*', 'video/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  disabled = false,
  uploadProgress = 0,
  error,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxFileSize) {
          alert(`File ${file.name} is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`);
          return false;
        }
        return true;
      });

      if (uploadedFiles.length + validFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(newFiles);
      onFileUpload(validFiles);
    },
    [uploadedFiles, maxFileSize, maxFiles, onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    disabled,
  });

  const handleRemoveFile = (fileToRemove: File) => {
    const newFiles = uploadedFiles.filter((file) => file !== fileToRemove);
    setUploadedFiles(newFiles);
    onFileRemove?.(fileToRemove);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image />;
    } else if (file.type.startsWith('video/')) {
      return <VideoFile />;
    }
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select files
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Supported formats: Images (JPG, PNG, GIF, WebP), Videos (MP4, AVI, MOV)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Maximum file size: {maxFileSize / (1024 * 1024)}MB
        </Typography>
      </Paper>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading... {Math.round(uploadProgress)}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files ({uploadedFiles.length}/{maxFiles})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {uploadedFiles.map((file, index) => (
              <Chip
                key={index}
                icon={getFileIcon(file)}
                label={`${file.name} (${formatFileSize(file.size)})`}
                onDelete={() => handleRemoveFile(file)}
                deleteIcon={<Delete />}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload; 