import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import CategoriesPage from './pages/CategoriesPage';
import BudgetsPage from './pages/BudgetPage';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, height: '100vh', overflowY: 'auto', padding: '5px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
