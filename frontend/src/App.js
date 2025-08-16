import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EspacosPage from './pages/EspacosPage';
// ... importe outras páginas se necessário

// Importamos nosso componente de segurança
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* A rota de login é pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* As rotas abaixo agora estão protegidas */}
        <Route 
          path="/" 
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
        />
        <Route 
          path="/espacos" 
          element={<ProtectedRoute><EspacosPage /></ProtectedRoute>} 
        />
        {/* Adicione outras rotas protegidas aqui da mesma forma */}

      </Routes>
    </Router>
  );
}

export default App;