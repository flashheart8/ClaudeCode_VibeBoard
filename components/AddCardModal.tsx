'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { ColumnId } from '@/types';

interface AddCardModalProps {
  column: ColumnId;
  onAdd: (title: string, description: string, column: ColumnId) => void;
  onClose: () => void;
}

export default function AddCardModal({ column, onAdd, onClose }: AddCardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    inputRef.current?.focus();
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, description.trim(), column);
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200
        ${visible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-md rounded-xl border border-border bg-surface-raised shadow-2xl shadow-black/50 transition-all duration-200
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <h3
            className="text-base text-foreground"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            New Card
          </h3>
          <button
            onClick={handleClose}
            className="rounded-md p-1.5 text-muted-soft transition-colors hover:bg-surface-overlay hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>

        {/* Decorative line */}
        <div className="mx-5 mt-3 h-px bg-gradient-to-r from-border via-border-subtle to-transparent" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest text-muted mb-2">
              Title
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="What needs doing?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus-ring w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-soft/60 outline-none transition-colors focus:border-accent-dim/50 focus:bg-surface-raised"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-widest text-muted mb-2">
              Description
            </label>
            <textarea
              placeholder="Add some context... (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="focus-ring w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-soft/60 outline-none resize-none transition-colors focus:border-accent-dim/50 focus:bg-surface-raised"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-muted transition-all hover:text-foreground hover:bg-surface-overlay"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-lg bg-accent-dim px-4 py-2 text-xs font-medium text-white transition-all hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
