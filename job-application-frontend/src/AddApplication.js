import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = "https://applyboard-job-application-tracer.onrender.com";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const AddApplication = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    applicationDate: '',
    notes: '',
    status: 'APPLIED',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.companyName.trim() || !formData.role.trim()) {
      setMessage({ type: 'error', text: 'Company name and role are required' });
      return;
    }

    setSaving(true);

    let uploadedResumeId = null;

    // 1. Upload resume if selected
    if (resumeFile) {
      setUploading(true);
      try {
        const formDataFile = new FormData();
        formDataFile.append('file', resumeFile);

        const uploadRes = await axios.post(
          `${API}/resumes/upload`,
          formDataFile,
          {
            headers: {
              ...auth().headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        uploadedResumeId = uploadRes.data?.id;
        if (!uploadedResumeId) throw new Error('No resume ID returned');
      } catch (err) {
        setMessage({
          type: 'error',
          text: 'Resume upload failed: ' + (err.response?.data?.message || err.message)
        });
        setSaving(false);
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // 2. Create application
    try {
      const payload = {
        companyName: formData.companyName.trim(),
        role: formData.role.trim(),
        applicationDate: formData.applicationDate || null,
        notes: formData.notes?.trim() || null,
        status: formData.status,
      };

      const appRes = await axios.post(
        `${API}/applications`,
        payload,
        auth()
      );

      const newAppId = appRes.data?.id;
      if (!newAppId) throw new Error('Application created but no ID returned');

      // 3. Attach resume if uploaded
      // Add these two lines before axios.put
console.log("Attaching resume - App ID:", newAppId, "Resume ID:", uploadedResumeId);
console.log("Token being sent:", localStorage.getItem("token")?.slice(0, 20) + "...");
      if (uploadedResumeId) {
        await axios.put(
          `${API}/applications/${newAppId}/resume/${uploadedResumeId}`,
          {},
          auth()
        );
      }

      setMessage({ type: 'success', text: 'Application saved successfully!' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1800);

    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message ||
              (err.response?.status === 400 ? 'Validation error – check fields' : 'Failed to save application')
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} className="form-card app-container">
      <h2 style={{ textAlign: 'center', marginBottom: '32px' }} className="app-title">Add New Application</h2>

      {message.text && (
        <div style={{
          padding: '14px',
          marginBottom: '24px',
          borderRadius: '8px',
          background: message.type === 'success' ? '#e6ffed' : '#ffebee',
          color: message.type === 'success' ? '#006400' : '#c62828',
          textAlign: 'center'
        }} className="loading">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Role / Position *</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Application Date</label>
          <input
            type="date"
            name="applicationDate"
            value={formData.applicationDate}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="TEST">Test</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
            <option value="GHOSTED">Ghosted</option>
          </select>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label>Resume (PDF, Word)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          />
          {resumeFile && <div style={{ marginTop: '8px', color: '#555' }} className="muted small">Selected: {resumeFile.name}</div>}
          {uploading && <div style={{ color: '#1976d2', marginTop: '8px' }} className="muted small">Uploading resume...</div>}
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          />
        </div>

        <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center' }} className="flex gap-12">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{ padding: '12px 32px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px' }}
            className="btn-cancel"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || uploading}
            style={{
              padding: '12px 40px',
              background: saving || uploading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: saving || uploading ? 'not-allowed' : 'pointer'
            }}
            className="btn-save"
          >
            {saving || uploading ? 'Saving...' : 'Save Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddApplication;