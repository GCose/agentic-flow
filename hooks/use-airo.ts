// hooks/use-kairo.ts
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useLeads = () => {
  const { data, error, isLoading, mutate } = useSWR<{ leads: any }>(
    "https://178.63.40.80:5500/api/leads/",
    fetcher
  );

  console.log("Airo data:", data);

  return {
    leads: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
};

// 🔥 For a single lead
export const useLead = (id?: string | number) => {
  const shouldFetch = !!id;
  const { data, error, isLoading, mutate } = useSWR<any>(
    shouldFetch ? `http://178.63.40.80:5500/api/leads/${id}/` : null,
    fetcher
  );

  return {
    lead: data,
    isLoading,
    error,
    refresh: mutate,
  };
};
