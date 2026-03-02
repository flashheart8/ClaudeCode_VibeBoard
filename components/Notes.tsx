'use client';

import { useState } from 'react';

interface NotesProps {
  notes: string;
  setNotes: (notes: string | ((prev: string) => string)) => void;
}

export default function Notes({ notes, setNotes }: NotesProps) {
  const [isFocused, setIsFocused] = useState(false);

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className={`flex flex-1 flex-col rounded-xl border transition-colors duration-200
      ${isFocused ? 'border-accent-dim/25 bg-surface/60' : 'border-border-subtle bg-surface/40'}`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm tracking-tight text-foreground/80"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            Notes
          </h2>
          {wordCount > 0 && (
            <span className="text-[10px] font-medium text-muted-soft">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
          )}
        </div>
        <div className="mt-3 h-px bg-gradient-to-r from-border via-border-subtle to-transparent" />
      </div>

      {/* Textarea */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Jot something down..."
        className="flex-1 bg-transparent px-4 pb-4 text-[13px] leading-[1.7] text-foreground placeholder:text-muted-soft/30 placeholder:italic outline-none resize-none min-h-[160px]"
      />
    </div>
  );
}
