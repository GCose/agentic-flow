import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-store';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:81/ai-analysis-service';

const AnalysisPage = () => {
  const { user, token } = useAuth();
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_BASE}/api/v1/analysis`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setAnalysis(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load analysis');
        setLoading(false);
      });
  }, [token]);

  return (
    <div>
      <h1>AI Analysis</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {analysis.map((item, idx) => (
          <li key={item.id ?? idx}>{item.summary ?? item.name ?? JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default AnalysisPage;
