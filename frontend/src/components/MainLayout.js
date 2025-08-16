// frontend/src/components/MainLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Container } from '@mui/material';

function MainLayout() {
  return (
    <div>
      <Navbar />
      <Container component="main" sx={{ mt: 4 }}>
        {/* O Outlet é onde o conteúdo da página específica (Dashboard, Espaços, etc.) será renderizado */}
        <Outlet />
      </Container>
    </div>
  );
}

export default MainLayout;