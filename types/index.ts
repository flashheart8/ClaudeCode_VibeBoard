export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  column: 'todo' | 'in-progress' | 'complete';
  createdAt: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppData {
  cards: KanbanCard[];
  todos: TodoItem[];
  notes: string;
}

export type ColumnId = KanbanCard['column'];
