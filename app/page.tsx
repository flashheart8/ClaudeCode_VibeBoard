'use client';

import Board from '@/components/Board';
import TodoList from '@/components/TodoList';
import Notes from '@/components/Notes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { KanbanCard, TodoItem } from '@/types';
import { Sparkles } from 'lucide-react';

const SAMPLE_CARDS: KanbanCard[] = [
  {
    id: 'demo-1',
    title: 'Set up project scaffolding',
    description: 'Initialize Next.js with Tailwind, configure TypeScript paths and base layout structure.',
    column: 'complete',
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'demo-2',
    title: 'Design dark theme palette',
    description: 'Obsidian base tones with warm copper accent. Finalize CSS variables.',
    column: 'complete',
    createdAt: '2026-02-26T14:00:00Z',
  },
  {
    id: 'demo-3',
    title: 'Build Kanban drag-and-drop',
    description: 'Wire up @dnd-kit for cross-column card movement with sortable reordering.',
    column: 'in-progress',
    createdAt: '2026-02-27T09:00:00Z',
  },
  {
    id: 'demo-4',
    title: 'Add card creation modal',
    column: 'in-progress',
    createdAt: '2026-02-28T11:30:00Z',
  },
  {
    id: 'demo-5',
    title: 'Implement localStorage persistence',
    description: 'Custom hook with SSR safety, auto-save on every state change.',
    column: 'todo',
    createdAt: '2026-02-28T16:00:00Z',
  },
  {
    id: 'demo-6',
    title: 'Keyboard shortcuts',
    description: 'N for new card, Escape to close modals, arrow keys for navigation.',
    column: 'todo',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'demo-7',
    title: 'Mobile responsive layout',
    column: 'todo',
    createdAt: '2026-03-01T09:00:00Z',
  },
];

const SAMPLE_TODOS: TodoItem[] = [
  { id: 'todo-1', text: 'Review PR #42 — auth refactor', completed: true },
  { id: 'todo-2', text: 'Update dependencies to latest', completed: true },
  { id: 'todo-3', text: 'Write tests for drag-and-drop', completed: false },
  { id: 'todo-4', text: 'Deploy staging build', completed: false },
  { id: 'todo-5', text: 'Record demo video', completed: false },
];

const SAMPLE_NOTES = `Sprint 4 — Week of Mar 1

Focus: finish core board interactions, then polish.

Architecture notes:
- Keep all state in page.tsx, pass down via props
- localStorage hook handles serialization
- dnd-kit handles all drag logic internally

Remember to test with 20+ cards for scroll perf.`;

export default function Home() {
  const [cards, setCards] = useLocalStorage<KanbanCard[]>('vibeboard-cards-v2', SAMPLE_CARDS);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('vibeboard-todos-v2', SAMPLE_TODOS);
  const [notes, setNotes] = useLocalStorage<string>('vibeboard-notes-v2', SAMPLE_NOTES);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="animate-fade-in flex shrink-0 items-center justify-between border-b border-border-subtle px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Sparkles size={14} />
          </div>
          <h1
            className="text-xl tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            VibeBoard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] tracking-wide text-muted-soft">
            saved locally
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-success/60 animate-pulse" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Kanban board — left side */}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col p-5">
          <div className="flex-1 min-h-0">
            <Board cards={cards} setCards={setCards} />
          </div>
        </main>

        {/* Sidebar divider — decorative */}
        <div className="flex shrink-0 flex-col items-center py-6">
          <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-transparent" />
        </div>

        {/* Sidebar — right side */}
        <aside className="flex w-[340px] shrink-0 flex-col gap-3 overflow-y-auto p-5 pl-3">
          <div className="animate-fade-in-up stagger-3">
            <TodoList todos={todos} setTodos={setTodos} />
          </div>
          <div className="animate-fade-in-up stagger-4 flex-1 flex flex-col">
            <Notes notes={notes} setNotes={setNotes} />
          </div>
        </aside>
      </div>
    </div>
  );
}
