import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EspacosPage from './pages/EspacosPage';
import ReservasPage from './pages/ReservasPage';
import DepartamentosPage from './pages/DepartamentosPage';
import UsuariosPage from './pages/UsuariosPage';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Agrupamento de rotas protegidas que usarão o Layout Principal */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/espacos" element={<EspacosPage />} />

          {/* --- ROTAS FALTANTES ADICIONADAS AQUI --- */}
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;