import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../axios.js";

export const useProjects = () =>
  useQuery({ queryKey: ["projects"], queryFn: async () => (await api.get("/api/projects")).data });

export const useProject = (id) =>
  useQuery({
    queryKey: ["projects", id],
    queryFn: async () => (await api.get(`/api/projects/${id}`)).data,
    enabled: Boolean(id),
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/api/projects", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useAddMember = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role = "member" }) => api.post(`/api/projects/${projectId}/members`, { email, role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects", projectId] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
