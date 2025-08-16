import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Typography, Container, Button } from '@mui/material';

function DashboardPage() {
  // Usamos o contexto para pegar os dados do usuário e a função de logout
  const { user, logout } = useContext(AuthContext);

  // Se por algum motivo o user ainda não carregou, mostramos uma mensagem
  if (!user) {
    return <div>Carregando informações do usuário...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" sx={{ mt: 4 }}>
        Bem-vindo(a), {user.nome}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Seu perfil: {user.tipo}
      </Typography>
      <Button variant="contained" color="secondary" onClick={logout} sx={{ mt: 2 }}>
        Sair (Logout)
      </Button>

      {/* Aqui virão os botões de navegação para Espaços, Reservas, etc. */}
    </Container>
  );
}

export default DashboardPage;