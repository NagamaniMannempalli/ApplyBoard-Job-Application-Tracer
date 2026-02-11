// src/pages/EditApplication.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = "http://localhost:8080";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const EditApplication = () => {
  const { id } = useParams(); // from URL /edit/:id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    applicationDate: '',
    notes: '',
    status: 'APPLIED',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch existing application data
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`${API}/applications/${id}`, auth());
        const app = res.data;

        setFormData({
          companyName: app.companyName || '',
          role: app.role || '',
          applicationDate: app.applicationDate || '',
          notes: app.notes || '',
          status: app.status || 'APPLIED',
        });
      } catch (err) {
        setMessage({
          type: 'error',
          text: 'Failed to load application data',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.companyName.trim() || !formData.role.trim()) {
      setMessage({ type: 'error', text: 'Company name and role are required' });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        role: formData.role.trim(),
        applicationDate: formData.applicationDate || null,
        notes: formData.notes?.trim() || null,
        status: formData.status,
      };

      await axios.put(`${API}/applications/${id}`, payload, auth());

      setMessage({ type: 'success', text: 'Application updated successfully!' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          (err.response?.status === 403
            ? 'Permission denied - please check login'
            : 'Failed to update application'),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading application data...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} className="form-card app-container">
      <h2 style={{ textAlign: 'center', marginBottom: '32px' }} className="app-title">Edit Application</h2>

      {message.text && (
        <div
          style={{
            padding: '14px',
            marginBottom: '24px',
            borderRadius: '8px',
            background: message.type === 'success' ? '#e6ffed' : '#ffebee',
            color: message.type === 'success' ? '#006400' : '#c62828',
            textAlign: 'center',
          }}
          className="loading"
        >
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
            <option value="TEST">Test</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Rejected</option>
            <option value="GHOSTED">Ghosted</option>
          </select>
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
            disabled={saving}
            style={{
              padding: '12px 40px',
              background: saving ? '#ccc' : '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Update Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApplication;