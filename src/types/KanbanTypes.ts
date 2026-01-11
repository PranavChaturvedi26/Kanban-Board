export interface Card {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  columns: Column[];
}

export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface DragItem {
  cardId: string;
  sourceColumnId: string;
  sourceIndex: number;
}

export interface KanbanContextType {
  board: Board;
  addCard: (columnId: string, title: string) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  editCard: (columnId: string, cardId: string, newTitle: string) => void;
  moveCard: (
    sourceColumnId: string,
    targetColumnId: string,
    cardId: string,
    targetIndex: number
  ) => void;
}
