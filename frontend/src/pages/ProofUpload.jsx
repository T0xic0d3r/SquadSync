import React, { useState } from 'react';
import api from '../services/api';

const ProofUpload = ({ taskId, onSuccess }) => {
  const [proofType, setProofType] = useState('image');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (proofType === 'link' && !link) { setMessage('❌ Please enter a link'); return; }
    if (proofType !== 'link' && !file) { setMessage('❌ Please select a file'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('type', proofType);
      formData.append('caption', caption);
      if (file) formData.append('file', file);
      if (link) formData.append('link', link);
      await api.post(`/tasks/${taskId}/proof/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('✅ Proof submitted!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to upload proof'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', marginTop: '20px' }}>
      <h3>Submit Proof of Completion</h3>
      {message && <div style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <select value={proofType} onChange={e => setProofType(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
          <option value="image">📷 Photo/Screenshot</option>
          <option value="file">📄 Document/File</option>
          <option value="link">🔗 Link/URL</option>
        </select>
        {proofType === 'link'
          ? <input type="url" placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
          : <input type="file" onChange={e => setFile(e.target.files[0])} style={{ width: '100%', marginBottom: '10px' }} />
        }
        <textarea placeholder="Add a caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }} rows="2" />
        <button type="submit" disabled={uploading} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {uploading ? 'Uploading...' : 'Submit Proof'}
        </button>
      </form>
    </div>
  );
};

export default ProofUpload;
