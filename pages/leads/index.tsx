import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-store';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:81/lead-service';

const LeadsPage = () => {
  const { user, token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/api/v1/leads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setLeads(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load leads');
        setLoading(false);
      });
  }, [token]);

  return (
    <div>
      <h1>Leads</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {leads.map(lead => (
          <li key={lead.id}>{lead.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default LeadsPage;
