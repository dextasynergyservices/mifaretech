"use client";

import { History, Loader2, MessageSquare, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addEnquiryNoteAction,
  assignEnquiryAction,
  updateEnquiryStatusAction,
} from "@/server/actions/enquiries";

export interface StaffUserOption {
  id: string;
  name: string;
  email: string;
}

export interface NoteItem {
  id: string;
  body: string;
  createdAt: Date | string;
  authorName: string | null;
}

export interface StatusHistoryItem {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  changedByName: string | null;
  createdAt: Date | string;
}

interface EnquiryWorkflowProps {
  enquiryId: string;
  currentStatus: string;
  currentAssignedTo: string | null;
  staffUsers: StaffUserOption[];
  initialNotes: NoteItem[];
  statusHistory: StatusHistoryItem[];
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  {
    value: "in_progress",
    label: "In Progress",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    value: "quoted",
    label: "Quoted",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  { value: "won", label: "Won", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { value: "lost", label: "Lost", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  { value: "spam", label: "Spam", color: "bg-red-500/10 text-red-600 border-red-500/20" },
] as const;

export function EnquiryWorkflow({
  enquiryId,
  currentStatus: initialStatus,
  currentAssignedTo: initialAssignedTo,
  staffUsers,
  initialNotes,
  statusHistory,
}: EnquiryWorkflowProps) {
  const [status, setStatus] = useState(initialStatus);
  const [assignedTo, setAssignedTo] = useState<string | null>(initialAssignedTo);
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status) return;
    startTransition(async () => {
      try {
        const res = await updateEnquiryStatusAction({
          enquiryId,
          status: newStatus as "new" | "in_progress" | "quoted" | "won" | "lost" | "spam",
        });
        if (res.success) {
          setStatus(newStatus);
          toast.success(`Enquiry status changed to ${newStatus.replace("_", " ")}`);
        } else {
          toast.error(res.error || "Failed to update status");
        }
      } catch (_err) {
        toast.error("Failed to update enquiry status");
      }
    });
  };

  const handleAssigneeChange = (newAssignee: string) => {
    const val = newAssignee === "unassigned" ? null : newAssignee;
    startTransition(async () => {
      try {
        const res = await assignEnquiryAction({
          enquiryId,
          assignedTo: val,
        });
        if (res.success) {
          setAssignedTo(val);
          toast.success("Enquiry assignment updated");
        } else {
          toast.error("Failed to assign enquiry");
        }
      } catch (_err) {
        toast.error("Failed to update assignment");
      }
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    startTransition(async () => {
      try {
        const res = await addEnquiryNoteAction({
          enquiryId,
          body: newNote.trim(),
        });
        if (res.success && res.note) {
          const note = res.note;
          setNotes((prev) => [
            {
              id: note.id,
              body: note.body,
              createdAt: note.createdAt,
              authorName: "You",
            },
            ...prev,
          ]);
          setNewNote("");
          toast.success("Internal note added");
        } else {
          toast.error("Failed to add note");
        }
      } catch (_err) {
        toast.error("Failed to add internal note");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Workflow Controls Card */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Enquiry Workflow</span>
          {isPending && <Loader2 className="size-3.5 animate-spin text-brand-600" />}
        </h3>

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Lifecycle Status</label>
          <select
            value={status}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Assigned Staff Specialist</label>
          <select
            value={assignedTo || "unassigned"}
            disabled={isPending}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
          >
            <option value="unassigned">Unassigned (Pool)</option>
            {staffUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Status History Drawer / Accordion */}
        {statusHistory.length > 0 && (
          <div className="pt-3 border-t border-border space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
              <History className="size-3.5" />
              <span>Status History ({statusHistory.length})</span>
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {statusHistory.map((h) => (
                <div
                  key={h.id}
                  className="text-[10px] p-2 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-muted-foreground line-through">
                      {h.fromStatus || "none"}
                    </span>
                    <span>&rarr;</span>
                    <span className="font-bold text-foreground">{h.toStatus}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(h.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Internal Staff Notes Card */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <MessageSquare className="size-3.5 text-brand-600 dark:text-brand-400" />
          <span>Internal Staff Notes ({notes.length})</span>
        </h3>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add internal note, quotation details, or client call notes..."
            rows={2}
            className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !newNote.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors"
            >
              <Plus className="size-3" />
              <span>Add Note</span>
            </button>
          </div>
        </form>

        {/* Notes List */}
        {notes.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-2">
            No internal staff notes yet.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-xl bg-muted/30 border border-border text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-bold text-foreground">
                    {note.authorName || "Staff Member"}
                  </span>
                  <span>{new Date(note.createdAt).toLocaleString("en-GB")}</span>
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{note.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
