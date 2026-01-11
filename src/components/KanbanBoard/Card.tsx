import React, { useState, useRef, useEffect } from 'react';
import type { Card as CardType, DragItem } from '../../types/KanbanTypes';
import { useKanban } from '../../context/KanbanContext';

interface CardProps {
  card: CardType;
  columnId: string;
  index: number;
  onDragStart: (e: React.DragEvent, item: DragItem) => void;
  onDragEnd: () => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  columnId,
  index,
  onDragStart,
  onDragEnd,
}) => {
  const { editCard, deleteCard } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(card.title);
  };

  const handleSave = () => {
    if (editValue.trim() && editValue !== card.title) {
      editCard(columnId, card.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(card.title);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCard(columnId, card.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, {
      cardId: card.id,
      sourceColumnId: columnId,
      sourceIndex: index,
    });
  };

  return (
    <div
      className={`kanban-card ${isEditing ? 'editing' : ''}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          className="card-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          rows={3}
        />
      ) : (
        <>
          <div className="card-content">
            <p className="card-title">{card.title}</p>
          </div>
          <div className="card-actions">
            <button
              className="card-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setEditValue(card.title);
              }}
              title="Edit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className="card-btn delete-btn"
              onClick={handleDelete}
              title="Delete"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
