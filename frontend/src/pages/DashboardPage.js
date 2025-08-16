import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function DashboardPage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Carregando...</div>;
  }

  // Opções de menu visíveis para todos os usuários logados
  const menuOptions = [
    { title: 'Espaços', link: '/espacos', description: 'Consulte e gerencie os espaços' },
    { title: 'Reservas', link: '/reservas', description: 'Visualize e crie suas reservas' },
    { title: 'Departamentos', link: '/departamentos', description: 'Veja os departamentos da instituição' }
  ];

  // Opção de menu visível apenas para gestores
  if (user.tipo === 'gestor') {
    menuOptions.push({
      title: 'Gerenciar Usuários',
      link: '/usuarios',
      description: 'Adicione, edite e remova usuários'
    });
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Painel Principal
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {menuOptions.map((option) => (
          <Grid item xs={12} sm={6} md={4} key={option.title}>
            <Card>
              <CardActionArea component={RouterLink} to={option.link}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default DashboardPage;