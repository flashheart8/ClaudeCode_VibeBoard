'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import type { KanbanCard, ColumnId } from '@/types';

const STRIPE_COLORS: Record<ColumnId, string> = {
  'todo': 'bg-col-todo',
  'in-progress': 'bg-col-progress',
  'complete': 'bg-col-complete',
};

interface CardProps {
  card: KanbanCard;
  onDelete: (id: string) => void;
}

export default function Card({ card, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-lg border bg-surface transition-all duration-200
        ${isDragging
          ? 'opacity-40 scale-[1.02] shadow-xl shadow-black/40 border-accent-dim/30'
          : 'border-border-subtle hover:border-border-hover hover:bg-surface-raised hover:shadow-md hover:shadow-black/10'
        }`}
    >
      {/* Accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${STRIPE_COLORS[card.column]}`} />

      <div className="flex items-start gap-2 py-3 pr-3 pl-4">
        <button
          className="mt-0.5 shrink-0 cursor-grab text-muted-soft opacity-0 transition-all duration-150 group-hover:opacity-100 active:cursor-grabbing active:text-accent"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={13} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-foreground leading-snug tracking-[-0.01em]">
            {card.title}
          </p>
          {card.description && (
            <p className="mt-1.5 text-xs text-muted line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          )}
          <p className="mt-2 text-[10px] font-medium uppercase tracking-widest text-muted-soft">
            {formattedDate}
          </p>
        </div>
        <button
          onClick={() => onDelete(card.id)}
          className="shrink-0 mt-0.5 rounded-md p-1 text-muted-soft opacity-0 transition-all duration-150 hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
