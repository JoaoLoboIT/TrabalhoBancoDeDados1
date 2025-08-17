import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Typography, Container, Card, CardContent, CircularProgress, Alert, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, CardActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

function EspacosPage() {
  const { user, token } = useContext(AuthContext);
  const isGestor = user?.tipo === 'gestor';

  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    capacidade: ''
  });

  // --- MUDANÇA 1: Novo estado para saber se estamos editando ---
  const [editingEspaco, setEditingEspaco] = useState(null);

  const fetchEspacos = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/espacos')
      .then(response => {
        if (!response.ok) throw new Error('Falha ao buscar os dados da API');
        return response.json();
      })
      .then(data => {
        setEspacos(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEspacos();
  }, []);

  // --- MUDANÇA 2: Funções para abrir o modal ---
  const handleCreateClick = () => {
    setEditingEspaco(null); // Garante que não estamos em modo de edição
    setFormData({ nome: '', tipo: '', capacidade: '' }); // Limpa o formulário
    setOpen(true);
  };

  const handleEditClick = (espaco) => {
    setEditingEspaco(espaco); // Guarda o espaço que estamos editando
    setFormData({ // Preenche o formulário com os dados do espaço
      nome: espaco.nome,
      tipo: espaco.tipo,
      capacidade: espaco.capacidade || ''
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- MUDANÇA 3: A função de Salvar agora é inteligente ---
  const handleSubmit = () => {
    const isEditing = editingEspaco !== null;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `http://localhost:5000/api/espacos/${editingEspaco.espaco_id}` 
      : 'http://localhost:5000/api/espacos';

    const body = {
      ...formData,
      capacidade: parseInt(formData.capacidade, 10) || null,
      // Se estiver editando, usa o gestor que já existia. Se criando, usa o logado.
      gestor_responsavel_id: isEditing ? editingEspaco.gestor_responsavel_id : user.usuario_id
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(body)
    })
    .then(response => {
      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} o espaço.`);
      return response.json();
    })
    .then(() => {
      handleClose();
      fetchEspacos();
    })
    .catch(err => setError(err.message));
  };

  const handleDelete = (espacoId) => {
    // ... (função de deletar continua igual)
    if (window.confirm('Tem certeza que deseja deletar este espaço?')) {
      fetch(`http://localhost:5000/api/espacos/${espacoId}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      })
      .then(response => {
        if (!response.ok) throw new Error('Falha ao deletar o espaço.');
        return response.json();
      })
      .then(() => fetchEspacos())
      .catch(err => setError(err.message));
    }
  };

  let content;
  if (loading) content = <CircularProgress />;
  else if (error) content = <Alert severity="error">{error}</Alert>;
  else {
    content = espacos.map(espaco => (
      <Card key={espaco.espaco_id} variant="outlined" style={{ marginBottom: '10px' }}>
        <CardContent>
          <Typography variant="h6">{espaco.nome}</Typography>
          <Typography color="textSecondary">Tipo: {espaco.tipo}</Typography>
          <Typography color="textSecondary">Capacidade: {espaco.capacidade || 'Não informada'}</Typography>
        </CardContent>
        {isGestor && (
          <CardActions>
            {/* --- MUDANÇA 4: O botão de editar agora chama a função correta --- */}
            <Button size="small" color="primary" onClick={() => handleEditClick(espaco)}>Editar</Button>
            <Button size="small" color="secondary" onClick={() => handleDelete(espaco.espaco_id)}>Deletar</Button>
          </CardActions>
        )}
      </Card>
    ));
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Espaços
      </Typography>

      {isGestor && (
        <Button variant="contained" color="primary" onClick={handleCreateClick} style={{ marginBottom: '20px' }}>
          Adicionar Novo Espaço
        </Button>
      )}

      {content}

      <Dialog open={open} onClose={handleClose}>
        {/* --- MUDANÇA 5: Título do modal dinâmico --- */}
        <DialogTitle>{editingEspaco ? 'Editar Espaço' : 'Adicionar Novo Espaço'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="nome" label="Nome do Espaço" type="text" fullWidth variant="standard" value={formData.nome} onChange={handleInputChange} />
          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel id="tipo-select-label">Tipo</InputLabel>
            <Select labelId="tipo-select-label" name="tipo" value={formData.tipo} onChange={handleInputChange} label="Tipo">
              <MenuItem value={"sala_de_aula"}>Sala de Aula</MenuItem>
              <MenuItem value={"laboratorio"}>Laboratório</MenuItem>
              <MenuItem value={"auditorio"}>Auditório</MenuItem>
            </Select>
          </FormControl>
          <TextField margin="dense" name="capacidade" label="Capacidade" type="number" fullWidth variant="standard" value={formData.capacidade} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EspacosPage;