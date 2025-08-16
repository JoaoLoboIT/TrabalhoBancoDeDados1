import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EspacosPage from './pages/EspacosPage';
// ... importe outras páginas aqui

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* A rota de login continua pública e fora do layout principal */}
        <Route path="/login" element={<LoginPage />} />

        {/* Todas as rotas protegidas agora passam pelo MainLayout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/espacos" element={<EspacosPage />} />
          {/* Adicione outras rotas protegidas aqui, dentro deste grupo */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;