import React, { useState, useRef, useEffect } from 'react';
import type { Column as ColumnType, DragItem } from '../../types/KanbanTypes';
import { useKanban } from '../../context/KanbanContext';
import { Card } from './Card';

interface ColumnProps {
  column: ColumnType;
  dragItem: DragItem | null;
  onDragStart: (e: React.DragEvent, item: DragItem) => void;
  onDragEnd: () => void;
  onDrop: (targetColumnId: string, targetIndex: number) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  dragItem,
  onDragStart,
  onDragEnd,
  onDrop,
}) => {
  const { addCard } = useKanban();
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showAddCard && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddCard]);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setShowAddCard(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    } else if (e.key === 'Escape') {
      setShowAddCard(false);
      setNewCardTitle('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem) return;

    const columnElement = e.currentTarget as HTMLElement;
    const cardsContainer = columnElement.querySelector('.column-cards');
    if (!cardsContainer) return;

    const cards = Array.from(cardsContainer.querySelectorAll('.kanban-card'));
    const mouseY = e.clientY;

    let newDropIndex = cards.length;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const rect = card.getBoundingClientRect();
      const cardMiddle = rect.top + rect.height / 2;

      if (mouseY < cardMiddle) {
        newDropIndex = i;
        break;
      }
    }

    // Adjust index if dragging within the same column
    if (dragItem.sourceColumnId === column.id && dragItem.sourceIndex < newDropIndex) {
      newDropIndex = Math.max(0, newDropIndex - 1);
    }

    setDropIndex(newDropIndex);
  };

  const handleDragLeave = () => {
    setDropIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem) return;

    const finalIndex = dropIndex !== null ? dropIndex : column.cards.length;
    onDrop(column.id, finalIndex);
    setDropIndex(null);
  };

  const getColumnHeaderColor = () => {
    switch (column.id) {
      case 'todo':
        return '#6366f1';
      case 'in-progress':
        return '#f59e0b';
      case 'done':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header" style={{ borderTopColor: getColumnHeaderColor() }}>
        <h3 className="column-title">
          {column.title}
          <span className="card-count">{column.cards.length}</span>
        </h3>
      </div>

      <div className="column-cards">
        {column.cards.map((card, index) => (
          <React.Fragment key={card.id}>
            {dropIndex === index && dragItem && dragItem.sourceColumnId !== column.id && (
              <div className="drop-placeholder" />
            )}
            {dropIndex === index && dragItem && dragItem.sourceColumnId === column.id && dragItem.sourceIndex !== index && (
              <div className="drop-placeholder" />
            )}
            <Card
              card={card}
              columnId={column.id}
              index={index}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          </React.Fragment>
        ))}
        {dropIndex === column.cards.length && dragItem && (
          <div className="drop-placeholder" />
        )}
      </div>

      {showAddCard ? (
        <div className="add-card-form">
          <textarea
            ref={inputRef}
            className="add-card-input"
            placeholder="Enter card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <div className="add-card-actions">
            <button className="btn btn-primary" onClick={handleAddCard}>
              Add Card
            </button>
            <button
              className="btn btn-cancel"
              onClick={() => {
                setShowAddCard(false);
                setNewCardTitle('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setShowAddCard(true)}>
          <span className="plus-icon">+</span> Add a card
        </button>
      )}
    </div>
  );
};
