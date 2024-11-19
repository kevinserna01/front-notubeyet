import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardMain from './components/DashboardMain'; // Importar el nuevo componente
import Dashboard from './components/Dashboard'; // Importar el componente Dashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} /> {/* Ruta inicial para el Login */}
        <Route path="/register" element={<Register />} /> {/* Ruta para registro */}
        <Route path="/dashboard-main" element={<DashboardMain />} /> {/* Ruta principal después del login */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Ruta para Dashboard */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
