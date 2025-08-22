// hooks/use-kairo.ts
import useSWR from "swr";
import axios from "axios";
import { useEffect, useState } from "react";
import { loggedInUser } from "../utils/auth";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useLeads = () => {
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const user = loggedInUser();
    setClientId(user?.id);
  }, []);
  const shouldFetch = !!clientId;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/proxy/kairo?client_id=${clientId}` : null,
    fetcher
  );
  return {
    leads: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
};

export const useLead = (id?: string | number) => {
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const user = loggedInUser();
    setClientId(user?.id);
  }, []);
  const shouldFetch = !!clientId && !!id;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/proxy/kairo/${id}?client_id=${clientId}` : null,
    fetcher
  );
  return {
    lead: data,
    isLoading,
    error,
    refresh: mutate,
  };
};

export const useDeleteLead = () => {
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  useEffect(() => {
    const user = loggedInUser();
    setClientId(user?.id);
  }, []);
  const deleteLead = async (id: string | number) => {
    if (!id || !clientId) throw new Error("Lead ID and client_id are required");
    const response = await axios.delete(
      `/api/proxy/kairo/${id}?client_id=${clientId}`
    );
    return response.data;
  };
  return { deleteLead };
};
