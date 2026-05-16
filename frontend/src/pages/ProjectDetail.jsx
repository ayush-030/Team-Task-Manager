import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAddMember, useProject } from "../api/hooks/useProjects.js";
import { useCreateTask, useTasks, useUpdateTask } from "../api/hooks/useTasks.js";
import KanbanBoard from "../components/KanbanBoard.jsx";
import Modal from "../components/Modal.jsx";
import AvatarStack from "../components/ui/AvatarStack.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import { completionPct } from "../utils/formatters.js";
import { isProjectAdmin, projectMemberIds } from "../utils/permissions.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: project } = useProject(id);
  const { data: tasks = [] } = useTasks(id);
  const createTask = useCreateTask(id);
  const updateTask = useUpdateTask();
  const addMember = useAddMember(id);
  const [taskOpen, setTaskOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("member");
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "medium", due_date: "" });
  const canManageProject = isProjectAdmin(project, user);

  const submitTask = async (e) => {
    e.preventDefault();
    await createTask.mutateAsync({ ...taskForm, due_date: taskForm.due_date || null });
    toast.success("Task created successfully");
    setTaskForm({ title: "", description: "", priority: "medium", due_date: "" });
    setTaskOpen(false);
  };

  const submitMember = async (e) => {
    e.preventDefault();
    await addMember.mutateAsync({ email: memberEmail, role: memberRole });
    toast.success("Member added to project");
    setMemberEmail("");
    setMemberRole("member");
  };

  const changeStatus = async (taskId, status) => {
    const task = tasks.find((item) => item.id === taskId);
    if (task && task.status !== status) {
      const payload = { status };
      if (status === "blocked") {
        const reason = window.prompt("Why is this task blocked?", task.blocked_reason || "");
        if (!reason?.trim()) return toast.error("Blocked tasks need a reason");
        payload.blocked_reason = reason.trim();
      }
      await updateTask.mutateAsync({ id: taskId, payload });
      toast.success("Task updated");
    }
  };

  const members = projectMemberIds(project).map((_, index) => `Member ${index + 1}`);
  const done = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-glow">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-indigo-200">Project</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{project?.name || "Project"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{project?.description || "No description yet."}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AvatarStack members={members.length ? members : ["Owner"]} />
            {canManageProject && <button className="btn-primary bg-white text-slate-950" onClick={() => setTaskOpen(true)}><Plus size={18} /> Add Task</button>}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        <StatCard label="Progress" value={`${completionPct(tasks)}%`} helper={`${done} of ${tasks.length} tasks complete`} />
        <StatCard label="Open Tasks" value={tasks.length - done} helper="Todo, active, review, or blocked work" />
        <StatCard label="Blocked" value={tasks.filter((task) => task.status === "blocked").length} helper="Tasks waiting on help" />
        <StatCard label="Members" value={projectMemberIds(project).length} helper="Project collaborators" />
      </section>

      {canManageProject && (
        <aside className="premium-card rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-950">Manage Members</h3>
              <p className="text-sm font-semibold text-slate-500">Invite an existing user by email.</p>
            </div>
            <form className="flex w-full gap-3 sm:w-auto" onSubmit={submitMember}>
              <input className="input min-w-0 sm:w-72" type="email" placeholder="member@example.com" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} required />
              <select className="input w-36" value={memberRole} onChange={(e) => setMemberRole(e.target.value)}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button className="btn-secondary" disabled={addMember.isPending}><UserPlus size={18} /> Add</button>
            </form>
          </div>
        </aside>
      )}

      <KanbanBoard tasks={tasks} onStatusChange={changeStatus} />

      <Modal title="Add task" open={taskOpen} onClose={() => setTaskOpen(false)}>
        <form className="grid gap-4" onSubmit={submitTask}>
          <label className="field-label">Title<input className="input" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required /></label>
          <label className="field-label">Description<textarea className="input min-h-28 resize-y" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">Priority<select className="input" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
            <label className="field-label">Due date<input className="input" type="date" value={taskForm.due_date} onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })} /></label>
          </div>
          <button className="btn-primary" disabled={createTask.isPending}>{createTask.isPending ? "Creating..." : "Create task"}</button>
        </form>
      </Modal>
    </div>
  );
}
