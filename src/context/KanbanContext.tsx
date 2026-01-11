import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Board, KanbanContextType, Card } from '../types/KanbanTypes';
import { initialBoardData } from '../data/mockData';

const KanbanContext = createContext<KanbanContextType | null>(null);

export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};

// Generate unique ID
const generateId = (): string => {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface KanbanProviderProps {
  children: React.ReactNode;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [board, setBoard] = useState<Board>(initialBoardData);

  const addCard = useCallback((columnId: string, title: string) => {
    const newCard: Card = {
      id: generateId(),
      title,
      createdAt: new Date(),
    };

    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      ),
    }));
  }, []);

  const deleteCard = useCallback((columnId: string, cardId: string) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      ),
    }));
  }, []);

  const editCard = useCallback((columnId: string, cardId: string, newTitle: string) => {
    setBoard((prevBoard) => ({
      ...prevBoard,
      columns: prevBoard.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === cardId ? { ...card, title: newTitle } : card
              ),
            }
          : column
      ),
    }));
  }, []);

  const moveCard = useCallback(
    (
      sourceColumnId: string,
      targetColumnId: string,
      cardId: string,
      targetIndex: number
    ) => {
      setBoard((prevBoard) => {
        // Find the card to move
        const sourceColumn = prevBoard.columns.find((col) => col.id === sourceColumnId);
        const cardToMove = sourceColumn?.cards.find((card) => card.id === cardId);

        if (!cardToMove) return prevBoard;

        // Create new columns array
        const newColumns = prevBoard.columns.map((column) => {
          // Remove card from source column
          if (column.id === sourceColumnId) {
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId),
            };
          }
          return column;
        });

        // Add card to target column at the correct index
        return {
          ...prevBoard,
          columns: newColumns.map((column) => {
            if (column.id === targetColumnId) {
              const newCards = [...column.cards];
              // If moving within the same column, adjust the index
              const adjustedIndex =
                sourceColumnId === targetColumnId
                  ? Math.min(targetIndex, newCards.length)
                  : targetIndex;
              newCards.splice(adjustedIndex, 0, cardToMove);
              return { ...column, cards: newCards };
            }
            return column;
          }),
        };
      });
    },
    []
  );

  const value: KanbanContextType = {
    board,
    addCard,
    deleteCard,
    editCard,
    moveCard,
  };

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};
