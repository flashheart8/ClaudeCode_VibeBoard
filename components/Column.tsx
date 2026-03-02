'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import Card from './Card';
import type { KanbanCard, ColumnId } from '@/types';

const COLUMN_CONFIG: Record<ColumnId, { label: string; dotColor: string; glowColor: string }> = {
  'todo': {
    label: 'Todo',
    dotColor: 'bg-muted',
    glowColor: 'shadow-muted/20',
  },
  'in-progress': {
    label: 'In Progress',
    dotColor: 'bg-col-progress',
    glowColor: 'shadow-col-progress/20',
  },
  'complete': {
    label: 'Complete',
    dotColor: 'bg-col-complete',
    glowColor: 'shadow-col-complete/20',
  },
};

interface ColumnProps {
  id: ColumnId;
  cards: KanbanCard[];
  onDeleteCard: (id: string) => void;
  onAddClick: (column: ColumnId) => void;
}

export default function Column({ id, cards, onDeleteCard, onAddClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = COLUMN_CONFIG[id];

  return (
    <div
      className={`flex flex-col flex-1 min-h-0 rounded-xl border transition-all duration-300
        ${isOver
          ? 'border-accent-dim/30 bg-accent-glow shadow-lg shadow-accent/5'
          : 'border-border-subtle bg-surface/40'
        }`}
    >
      {/* Column header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 rounded-full ${config.dotColor} shadow-sm ${config.glowColor}`} />
          <h2
            className="text-sm tracking-tight text-foreground/80"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            {config.label}
          </h2>
          <span className="ml-auto rounded-full bg-surface-overlay/60 px-2 py-0.5 text-[10px] font-medium text-muted">
            {cards.length}
          </span>
        </div>
        <div className="mt-3 h-px bg-gradient-to-r from-border via-border-subtle to-transparent" />
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 px-3 pb-2 min-h-0 overflow-y-auto"
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </SortableContext>

        {cards.length === 0 && !isOver && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[11px] text-muted-soft/50 italic">drop here</p>
          </div>
        )}
      </div>

      {/* Add button */}
      {id !== 'complete' && (
        <div className="px-3 pb-3">
          <button
            onClick={() => onAddClick(id)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs text-muted transition-all duration-200 hover:border-accent-dim/40 hover:text-accent hover:bg-accent-glow"
          >
            <Plus size={13} strokeWidth={2} />
            Add card
          </button>
        </div>
      )}
    </div>
  );
}
