import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import {
  Delete,
  PlayArrow,
  Pause,
  Fullscreen,
  ZoomIn,
  Download,
} from '@mui/icons-material';

interface MediaFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface ImageGalleryProps {
  mediaFiles: MediaFile[];
  onDelete?: (fileId: number) => void;
  onDownload?: (file: MediaFile) => void;
  maxHeight?: number;
  showActions?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  mediaFiles,
  onDelete,
  onDownload,
  maxHeight = 400,
  showActions = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<{ [key: number]: boolean }>({});

  const handleFileClick = (file: MediaFile) => {
    setSelectedFile(file);
  };

  const handleCloseDialog = () => {
    setSelectedFile(null);
  };

  const handleDelete = (fileId: number) => {
    onDelete?.(fileId);
  };

  const handleDownload = (file: MediaFile) => {
    onDownload?.(file);
  };

  const toggleVideoPlay = (fileId: number) => {
    setIsVideoPlaying(prev => ({
      ...prev,
      [fileId]: !prev[fileId]
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (mediaFiles.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No media files uploaded yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload images or videos to see them here
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {mediaFiles.map((file) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => handleFileClick(file)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component={file.fileType === 'video' ? 'video' : 'img'}
                  height={maxHeight}
                  image={file.fileType === 'video' ? undefined : file.fileUrl}
                  src={file.fileType === 'video' ? file.fileUrl : undefined}
                  alt={file.fileName}
                  sx={{
                    objectFit: 'cover',
                    backgroundColor: 'grey.100',
                  }}
                  controls={file.fileType === 'video'}
                  autoPlay={file.fileType === 'video' && isVideoPlaying[file.id]}
                  muted
                />
                
                {file.fileType === 'video' && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVideoPlay(file.id);
                    }}
                  >
                    {isVideoPlaying[file.id] ? <Pause /> : <PlayArrow />}
                  </IconButton>
                )}

                <Chip
                  label={file.fileType.toUpperCase()}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                  }}
                />
              </Box>

              {showActions && (
                <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {file.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.fileSize)} • {formatDate(file.createdAt)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    {onDownload && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                      >
                        <Download />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Full-screen dialog */}
      <Dialog
        open={!!selectedFile}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedFile && (
            <Box sx={{ position: 'relative' }}>
              {selectedFile.fileType === 'video' ? (
                <video
                  src={selectedFile.fileUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <img
                  src={selectedFile.fileUrl}
                  alt={selectedFile.fileName}
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedFile && onDownload && (
            <Button
              onClick={() => {
                handleDownload(selectedFile);
                handleCloseDialog();
              }}
              startIcon={<Download />}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageGallery; 