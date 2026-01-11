import type { Board } from '../types/KanbanTypes';

export const initialBoardData: Board = {
  columns: [
    {
      id: 'todo',
      title: 'Todo',
      cards: [
        {
          id: 'card-1',
          title: 'Research project requirements',
          createdAt: new Date('2024-01-10'),
        },
        {
          id: 'card-2',
          title: 'Create wireframes for new feature',
          createdAt: new Date('2024-01-11'),
        },
        {
          id: 'card-3',
          title: 'Review pull requests',
          createdAt: new Date('2024-01-12'),
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        {
          id: 'card-4',
          title: 'Implement authentication module',
          createdAt: new Date('2024-01-08'),
        },
        {
          id: 'card-5',
          title: 'Write unit tests for API',
          createdAt: new Date('2024-01-09'),
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        {
          id: 'card-6',
          title: 'Setup development environment',
          createdAt: new Date('2024-01-05'),
        },
        {
          id: 'card-7',
          title: 'Database schema design',
          createdAt: new Date('2024-01-06'),
        },
      ],
    },
  ],
};
