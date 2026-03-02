'use client';

import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { TodoItem } from '@/types';

interface TodoListProps {
  todos: TodoItem[];
  setTodos: (todos: TodoItem[] | ((prev: TodoItem[]) => TodoItem[])) => void;
}

export default function TodoList({ todos, setTodos }: TodoListProps) {
  const [input, setInput] = useState('');

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: uuidv4(), text: trimmed, completed: false },
    ]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col rounded-xl border border-border-subtle bg-surface/40">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm tracking-tight text-foreground/80"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            Checklist
          </h2>
          {todos.length > 0 && (
            <span className="text-[10px] font-medium text-muted-soft">
              {completedCount}/{todos.length}
            </span>
          )}
        </div>
        {/* Progress bar */}
        {todos.length > 0 && (
          <div className="mt-2.5 h-[2px] rounded-full bg-border-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-success transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / todos.length) * 100}%` }}
            />
          </div>
        )}
        <div className="mt-3 h-px bg-gradient-to-r from-border via-border-subtle to-transparent" />
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-2 pb-1 space-y-0.5 max-h-[240px]">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-surface-raised/60"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200
                ${todo.completed
                  ? 'border-success/60 bg-success/15 text-success'
                  : 'border-border-hover hover:border-accent-dim/50 hover:bg-accent-glow'
                }`}
            >
              {todo.completed && <Check size={10} strokeWidth={3} />}
            </button>
            <span
              className={`flex-1 text-[13px] leading-snug transition-all duration-200
                ${todo.completed
                  ? 'text-muted-soft line-through decoration-muted-soft/40'
                  : 'text-foreground'
                }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="shrink-0 rounded-md p-1 text-muted-soft opacity-0 transition-all duration-150 hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))}

        {todos.length === 0 && (
          <p className="px-2 py-4 text-center text-xs italic text-muted-soft/40">
            Nothing here yet
          </p>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border-subtle px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 transition-colors focus-within:border-accent-dim/40 focus-within:bg-surface-raised">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add item..."
            className="flex-1 bg-transparent py-0.5 text-[13px] text-foreground placeholder:text-muted-soft/40 outline-none"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="rounded-md p-0.5 text-muted transition-colors hover:text-accent disabled:opacity-20"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
