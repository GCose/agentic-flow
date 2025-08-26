// hooks/use-kairo.ts
import useSWR from "swr";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useLeads = () => {
  const { user } = useAuth();
  const clientId = user?.id;
  const shouldFetch = !!clientId;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/proxy/airo?client_id=${clientId}` : null,
    fetcher
  );
  // console.log("Client Id from use-airo hook :",clientId)
  return {
    leads: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
};

export const useLead = (lead_id?: string | number) => {
  const { user } = useAuth();
  const clientId = user?.id;
  const shouldFetch = !!clientId && !!lead_id;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/proxy/airo/${lead_id}?client_id=${clientId}` : null,
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
  const { user } = useAuth();
  const clientId = user?.id;
  const deleteLead = async (lead_id: string | number) => {
    if (!lead_id || !clientId)
      throw new Error("Lead ID and client_id are required");
    const response = await axios.delete(
      `/api/proxy/airo/${lead_id}?client_id=${clientId}`
    );
    return response.data;
  };
  return { deleteLead };
};
