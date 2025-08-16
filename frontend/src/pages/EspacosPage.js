import React from 'react';
import { Typography, Button, Container } from '@mui/material'; // Importando componentes do MUI

function EspacosPage() {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px' }}>
        Gerenciamento de Espaços
      </Typography>
      <p>Aqui vamos listar todos os espaços disponíveis cadastrados no sistema.</p>
      <Button variant="contained" color="primary">
        Adicionar Novo Espaço
      </Button>
    </Container>
  );
}

export default EspacosPage;