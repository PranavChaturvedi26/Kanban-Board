import { KanbanBoard } from './components/KanbanBoard';
import { KanbanProvider } from './context/KanbanContext';
import './App.css';

function App() {
  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}

export default App;
