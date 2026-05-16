import { useQuery } from "@tanstack/react-query";
import api from "../axios.js";

export const useDashboard = () =>
  useQuery({ queryKey: ["dashboard"], queryFn: async () => (await api.get("/api/dashboard")).data });
