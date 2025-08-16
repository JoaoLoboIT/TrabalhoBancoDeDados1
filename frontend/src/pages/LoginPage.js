// frontend/src/pages/LoginPage.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 1. Importamos nosso contexto

// Importando componentes do Material-UI para criar o formulário
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';

function LoginPage() {
  // 2. Criamos estados para guardar o e-mail, a senha e possíveis erros
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  // 3. Pegamos a função de login do nosso contexto global
  const { login } = useContext(AuthContext);

  // 4. Pegamos a função de navegação para redirecionar o usuário
  const navigate = useNavigate();

  // 5. Função que é chamada quando o formulário é enviado
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o recarregamento padrão da página
    setError(''); // Limpa erros antigos

    try {
      // Faz a chamada para a nossa API de login
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a API retornou um erro (ex: 401 Credenciais inválidas), nós o pegamos aqui
        throw new Error(data.erro || 'Falha no login');
      }

      // 6. Se o login deu certo, chamamos a função 'login' do nosso contexto
      // O token será guardado na nossa "memória global"
      login(data.token);

      // 7. Redirecionamos o usuário para a página principal (Dashboard)
      navigate('/');

    } catch (err) {
      // 8. Se qualquer erro acontecer, guardamos a mensagem para exibir na tela
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Endereço de E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {/* Mostra a mensagem de erro, se houver alguma */}
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;