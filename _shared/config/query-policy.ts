export const QUERY_TIMES = {
  lists: {
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000, // 60 minutes
  },
  groups: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
};
