// hooks/use-kairo.ts
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useLeads = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/proxy/kairo",
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
  const shouldFetch = !!id;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/proxy/kairo/${id}` : null,
    fetcher
  );

  return {
    lead: data,
    isLoading,
    error,
    refresh: mutate,
  };
};
