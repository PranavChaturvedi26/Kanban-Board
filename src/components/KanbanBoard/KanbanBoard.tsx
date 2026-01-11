import React, { useState, useCallback } from 'react';
import type { DragItem } from '../../types/KanbanTypes';
import { useKanban } from '../../context/KanbanContext';
import { Column } from './Column';
import './KanbanBoard.css';

export const KanbanBoard: React.FC = () => {
  const { board, moveCard } = useKanban();
  const [dragItem, setDragItem] = useState<DragItem | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: DragItem) => {
    setDragItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.cardId);

    // Add visual feedback after a small delay for the drag image
    setTimeout(() => {
      const target = e.target as HTMLElement;
      target.classList.add('dragging');
    }, 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragItem(null);
    // Remove visual feedback from all elements
    document.querySelectorAll('.dragging').forEach((el) => {
      el.classList.remove('dragging');
    });
  }, []);

  const handleDrop = useCallback(
    (targetColumnId: string, targetIndex: number) => {
      if (!dragItem) return;

      // Don't do anything if dropping in the same position
      if (
        dragItem.sourceColumnId === targetColumnId &&
        dragItem.sourceIndex === targetIndex
      ) {
        return;
      }

      moveCard(
        dragItem.sourceColumnId,
        targetColumnId,
        dragItem.cardId,
        targetIndex
      );
    },
    [dragItem, moveCard]
  );

  return (
    <div className="kanban-board">
      <div className="board-header">
        <h1>Kanban Board</h1>
        <p className="board-subtitle">Drag and drop cards to organize your tasks</p>
      </div>

      <div className="board-columns">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            dragItem={dragItem}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
