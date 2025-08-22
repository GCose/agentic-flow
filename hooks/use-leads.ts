import { useState, useEffect } from 'react';

export interface Lead {
    id: string;
    name: string;
    email: string;
    status: string;
    [key: string]: any;
}

export interface UseLeadsOptions {
    initialLeads?: Lead[];
    fetchLeads?: () => Promise<Lead[]>;
}

export function useLeads(options: UseLeadsOptions = {}) {
    const [leads, setLeads] = useState<Lead[]>(options.initialLeads || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (options.fetchLeads) {
            setLoading(true);
            options.fetchLeads()
                .then(fetchedLeads => setLeads(fetchedLeads))
                .catch(err => setError(err.message || 'Failed to fetch leads'))
                .finally(() => setLoading(false));
        }
    }, [options.fetchLeads]);

    const addLead = (lead: Lead) => setLeads(prev => [...prev, lead]);
    const updateLead = (id: string, updated: Partial<Lead>) =>
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updated } : lead));
    const removeLead = (id: string) =>
        setLeads(prev => prev.filter(lead => lead.id !== id));

    return {
        leads,
        loading,
        error,
        addLead,
        updateLead,
        removeLead,
        setLeads,
    };
}