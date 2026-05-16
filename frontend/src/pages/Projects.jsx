import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { useCreateProject, useProjects } from "../api/hooks/useProjects.js";
import { useAllProjectTasks } from "../api/hooks/useTasks.js";
import ProjectCard from "../components/ProjectCard.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { CardSkeleton } from "../components/ui/Skeleton.jsx";

export default function Projects() {
  const { user } = useAuth();
  const { data = [], isLoading } = useProjects();
  const { tasks } = useAllProjectTasks(data);
  const createProject = useCreateProject();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const submit = async (e) => {
    e.preventDefault();
    await createProject.mutateAsync(form);
    toast.success("Project created successfully");
    setForm({ name: "", description: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-gradient-to-br from-slate-950 to-indigo-950 p-6 text-white shadow-glow">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-200">Portfolio</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">Projects that show their pulse.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Track progress, members, task volume, and status across every workspace you can access.</p>
        </div>
        {user?.role === "admin" && <button className="btn-primary bg-white text-slate-950" onClick={() => setOpen(true)}><Plus size={18} /> New Project</button>}
      </section>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : data.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((project) => <ProjectCard key={project.id} project={project} tasks={tasks.filter((task) => task.project_id === project.id)} />)}
        </section>
      ) : (
        <EmptyState title="No projects yet" description="Admins can create the first project and invite members to collaborate." action={user?.role === "admin" && <button className="btn-primary" onClick={() => setOpen(true)}>Create project</button>} />
      )}

      <Modal title="New project" open={open} onClose={() => setOpen(false)}>
        <form className="grid gap-4" onSubmit={submit}>
          <label className="field-label">Name<input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="field-label">Description<textarea className="input min-h-28 resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <button className="btn-primary" disabled={createProject.isPending}>{createProject.isPending ? "Creating..." : "Create project"}</button>
        </form>
      </Modal>
    </div>
  );
}
