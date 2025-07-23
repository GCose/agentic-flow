import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useLeads = () => {
  const { data, error, isLoading, mutate } = useSWR<{ leads: any }>(
    "http://178.63.40.80:5600/api/audits/",
    fetcher
  );

  console.log("Kairo data:", data);
  console.error("Kairo error:", error);

  return {
    leads: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
};

export const useLead = (id?: string | number) => {
  const shouldFetch = !!id;
  const { data, error, isLoading, mutate } = useSWR<any>(
    shouldFetch ? `http://178.63.40.80:5600/api/audits/${id}/` : null,
    fetcher
  );

  return {
    lead: data,
    isLoading,
    error,
    refresh: mutate,
  };
};
