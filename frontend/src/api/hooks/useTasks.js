import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axios.js";

export const useTasks = (projectId) =>
  useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: async () => (await api.get(`/api/projects/${projectId}/tasks`)).data,
    enabled: Boolean(projectId),
  });

export const useAllProjectTasks = (projects = []) => {
  const queries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["projects", project.id, "tasks"],
      queryFn: async () => (await api.get(`/api/projects/${project.id}/tasks`)).data,
      enabled: Boolean(project.id),
    })),
  });
  return {
    queries,
    isLoading: queries.some((query) => query.isLoading),
    tasks: queries.flatMap((query) => query.data || []),
  };
};

export const useTask = (id) =>
  useQuery({ queryKey: ["tasks", id], queryFn: async () => (await api.get(`/api/tasks/${id}`)).data });

export const useCreateTask = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post(`/api/projects/${projectId}/tasks`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects", projectId, "tasks"] }),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.put(`/api/tasks/${id}`, payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["tasks", vars.id] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
