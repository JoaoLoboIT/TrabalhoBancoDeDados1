import React, { useState, useEffect } from 'react'; // 1. Importamos os hooks
import { Typography, Container, Card, CardContent, CircularProgress, Alert } from '@mui/material'; // Importamos mais componentes

function EspacosPage() {
  // 2. Criamos um "estado" para guardar a lista de espaços
  const [espacos, setEspacos] = useState([]);
  // Estados para controlar o carregamento e os erros
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. useEffect para buscar os dados da API quando o componente carregar
  useEffect(() => {
    // A função fetch faz a chamada para a nossa API back-end
    fetch('http://localhost:5000/api/espacos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha ao buscar os dados da API');
        }
        return response.json();
      })
      .then(data => {
        setEspacos(data); // 4. Guardamos os dados recebidos no nosso estado
        setLoading(false); // Paramos de mostrar o "carregando"
      })
      .catch(error => {
        setError(error.message); // Guardamos a mensagem de erro
        setLoading(false); // Paramos de mostrar o "carregando"
      });
  }, []); // O [] vazio significa "execute esta função apenas uma vez, quando o componente montar"

  // Lógica para renderizar o conteúdo
  let content;
  if (loading) {
    content = <CircularProgress />; // Mostra um ícone de "carregando"
  } else if (error) {
    content = <Alert severity="error">{error}</Alert>; // Mostra uma caixa de erro
  } else {
    // 5. Usamos .map() para criar um Card para cada espaço na lista
    content = espacos.map(espaco => (
      <Card key={espaco.espaco_id} variant="outlined" style={{ marginBottom: '10px' }}>
        <CardContent>
          <Typography variant="h6">{espaco.nome}</Typography>
          <Typography color="textSecondary">Tipo: {espaco.tipo}</Typography>
          <Typography color="textSecondary">Capacidade: {espaco.capacidade || 'Não informada'}</Typography>
        </CardContent>
      </Card>
    ));
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px' }}>
        Gerenciamento de Espaços
      </Typography>

      {content}

    </Container>
  );
}

export default EspacosPage;