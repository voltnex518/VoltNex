import React, { useState } from 'react';
import { Mail, Trash2, CheckCircle2, Reply, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminMessagesPage: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useData();
  const { success } = useToast();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleMarkRead = async (id: string) => {
    await markMessageRead(id);
    success('Marked as Read', 'Status updated.');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteMessage(deleteTargetId);
    success('Message Deleted', 'Inquiry removed from inbox.');
    setDeleteTargetId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Visitor Inquiries & Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Incoming contact form messages stored securely in the database.
          </p>
        </div>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUnread = msg.status === 'unread';
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border p-6 shadow-subtle transition ${
                  isUnread ? 'border-blue-300 ring-1 ring-blue-100 bg-blue-50/10' : 'border-slate-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isUnread ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                    <h3 className="font-bold text-slate-900 text-sm">{msg.subject}</h3>
                    {isUnread && (
                      <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <div className="text-xs text-slate-500 font-mono">
                    From: <strong className="text-slate-800">{msg.name}</strong> &lt;
                    <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">
                      {msg.email}
                    </a>
                    &gt;
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {isUnread && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkRead(msg.id)}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    >
                      Mark Read
                    </Button>
                  )}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                  <button
                    onClick={() => setDeleteTargetId(msg.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Mail}
          title="Inbox is clear"
          description="No visitor contact submissions received yet."
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this inquiry?"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};
