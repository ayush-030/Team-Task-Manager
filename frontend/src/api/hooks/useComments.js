import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axios.js";

export const useComments = (taskId) =>
  useQuery({
    queryKey: ["tasks", taskId, "comments"],
    queryFn: async () => (await api.get(`/api/tasks/${taskId}/comments`)).data,
  });

export const usePostComment = (taskId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`/api/tasks/${taskId}/comments`, { body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", taskId, "comments"] });
      qc.invalidateQueries({ queryKey: ["tasks", taskId] });
    },
  });
};

export const useDeleteComment = (taskId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/comments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", taskId, "comments"] }),
  });
};
