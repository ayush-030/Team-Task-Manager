import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { useComments, useDeleteComment, usePostComment } from "../api/hooks/useComments.js";
import { relativeTime } from "../utils/relativeTime.js";
import { initials } from "../utils/formatters.js";
import EmptyState from "./ui/EmptyState.jsx";
import { Skeleton } from "./ui/Skeleton.jsx";

export default function CommentSection({ taskId }) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const { data = [], isLoading } = useComments(taskId);
  const post = usePostComment(taskId);
  const remove = useDeleteComment(taskId);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    await post.mutateAsync(body);
    toast.success("Comment posted");
    setBody("");
  };

  const deleteComment = async (id) => {
    await remove.mutateAsync(id);
    toast.success("Comment deleted");
  };

  return (
    <section className="premium-card rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">Comments</h2>
          <p className="text-sm font-semibold text-slate-500">Keep task decisions close to the work.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{data.length}</span>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && <><Skeleton className="h-20" /><Skeleton className="h-20" /></>}
        {!isLoading && data.length === 0 && <EmptyState title="No comments yet" description="Start the discussion with a note, blocker, or decision." />}
        {data.map((comment) => (
          <article className="grid grid-cols-[42px_1fr_auto] gap-3 rounded-2xl border border-slate-200 bg-white p-4" key={comment.id}>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-700">
              {initials(comment.author_username)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-sm font-black text-slate-950">{comment.author_username || "Unknown"}</strong>
                <span className="text-xs font-semibold text-slate-400">{relativeTime(comment.created_at)}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{comment.body}</p>
            </div>
            {comment.author_id === user?.id && (
              <button className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600" title="Delete comment" onClick={() => deleteComment(comment.id)}>
                <Trash2 size={16} />
              </button>
            )}
          </article>
        ))}
      </div>

      <form className="mt-5 grid gap-3" onSubmit={submit}>
        <textarea className="input min-h-28 resize-y" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a comment..." />
        <button className="btn-primary justify-self-end" disabled={post.isPending}><Send size={17} /> {post.isPending ? "Posting..." : "Post"}</button>
      </form>
    </section>
  );
}
