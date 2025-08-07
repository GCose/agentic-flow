// hooks/use-kairo.ts
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useLeads = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/proxy/airo", fetcher);

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
    shouldFetch ? `/api/proxy/airo/${id}` : null,
    fetcher // already defined above
  );

  return {
    lead: data,
    isLoading,
    error,
    refresh: mutate,
  };
};

export const useDeleteLead = () => {
  const deleteLead = async (id: string | number) => {
    if (!id) throw new Error("Lead ID is required");

    const response = await axios.delete(`/api/proxy/airo/${id}`);
    return response.data;
  };

  return { deleteLead };
};
