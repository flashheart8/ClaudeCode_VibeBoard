'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import Card from './Card';
import AddCardModal from './AddCardModal';
import type { KanbanCard, ColumnId } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const COLUMNS: ColumnId[] = ['todo', 'in-progress', 'complete'];

interface BoardProps {
  cards: KanbanCard[];
  setCards: (cards: KanbanCard[] | ((prev: KanbanCard[]) => KanbanCard[])) => void;
}

export default function Board({ cards, setCards }: BoardProps) {
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<ColumnId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const getColumnCards = useCallback(
    (column: ColumnId) => cards.filter((c) => c.column === column),
    [cards]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCardData = cards.find((c) => c.id === activeId);
    if (!activeCardData) return;

    let targetColumn: ColumnId;
    if (COLUMNS.includes(overId as ColumnId)) {
      targetColumn = overId as ColumnId;
    } else {
      const overCard = cards.find((c) => c.id === overId);
      if (!overCard) return;
      targetColumn = overCard.column;
    }

    if (activeCardData.column !== targetColumn) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, column: targetColumn } : c
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCardData = cards.find((c) => c.id === activeId);
    const overCardData = cards.find((c) => c.id === overId);

    if (activeCardData && overCardData && activeCardData.column === overCardData.column) {
      const columnCards = cards.filter((c) => c.column === activeCardData.column);
      const oldIndex = columnCards.findIndex((c) => c.id === activeId);
      const newIndex = columnCards.findIndex((c) => c.id === overId);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(columnCards, oldIndex, newIndex);
        setCards((prev) => {
          const otherCards = prev.filter((c) => c.column !== activeCardData.column);
          return [...otherCards, ...reordered];
        });
      }
    }
  };

  const handleAddCard = (title: string, description: string, column: ColumnId) => {
    const newCard: KanbanCard = {
      id: uuidv4(),
      title,
      description: description || undefined,
      column,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => [...prev, newCard]);
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {COLUMNS.map((col, i) => (
            <div key={col} className={`animate-fade-in-up stagger-${i + 1} flex flex-col min-h-0`}>
              <Column
                id={col}
                cards={getColumnCards(col)}
                onDeleteCard={handleDeleteCard}
                onAddClick={setAddingToColumn}
              />
            </div>
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {activeCard ? (
            <div className="rotate-[1.5deg] scale-[1.03] opacity-95">
              <div className="rounded-lg shadow-2xl shadow-black/50 ring-1 ring-accent-dim/20">
                <Card card={activeCard} onDelete={() => {}} />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {addingToColumn && (
        <AddCardModal
          column={addingToColumn}
          onAdd={handleAddCard}
          onClose={() => setAddingToColumn(null)}
        />
      )}
    </div>
  );
}
