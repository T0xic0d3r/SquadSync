import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress } from '@mui/material';
import { CloudUpload, Image, Link, Description } from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProofUpload = ({ open, taskId, onClose, onSuccess }) => {
  const [proofType, setProofType] = useState('image');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (proofType === 'link' && !link) {
      setError('Please enter a valid link');
      return;
    }
    if ((proofType === 'image' || proofType === 'file') && !file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('type', proofType);
      formData.append('caption', caption);
      if (file) formData.append('file', file);
      else if (link) formData.append('link', link);

      await api.post(`/tasks/${taskId}/proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Proof submitted! Waiting for approval.');
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload proof');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setLink('');
    setCaption('');
    setProofType('image');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit Proof of Completion</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Proof Type</InputLabel>
            <Select value={proofType} onChange={(e) => setProofType(e.target.value)} label="Proof Type">
              <MenuItem value="image"><Box display="flex" alignItems="center" gap={1}><Image fontSize="small" /> Photo/Screenshot</Box></MenuItem>
              <MenuItem value="file"><Box display="flex" alignItems="center" gap={1}><Description fontSize="small" /> Document/File</Box></MenuItem>
              <MenuItem value="link"><Box display="flex" alignItems="center" gap={1}><Link fontSize="small" /> Link/URL</Box></MenuItem>
            </Select>
          </FormControl>

          {proofType === 'image' && (
            <Box sx={{ mb: 3 }}>
              <input accept="image/*" style={{ display: 'none' }} id="image-upload" type="file" onChange={handleFileChange} />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" startIcon={<CloudUpload />} fullWidth>{file ? file.name : 'Upload Screenshot/Photo'}</Button>
              </label>
            </Box>
          )}

          {proofType === 'file' && (
            <Box sx={{ mb: 3 }}>
              <input style={{ display: 'none' }} id="file-upload" type="file" onChange={handleFileChange} />
              <label htmlFor="file-upload">
                <Button variant="outlined" component="span" startIcon={<CloudUpload />} fullWidth>{file ? file.name : 'Upload Document'}</Button>
              </label>
            </Box>
          )}

          {proofType === 'link' && (
            <TextField fullWidth label="URL Link" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} sx={{ mb: 3 }} />
          )}

          <TextField fullWidth label="Caption / Description" multiline rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe how you completed this task..." />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={uploading}>{uploading ? <CircularProgress size={24} /> : 'Submit Proof'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProofUpload;