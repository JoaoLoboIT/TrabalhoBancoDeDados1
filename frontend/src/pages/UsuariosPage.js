import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Typography, Container, List, ListItem, ListItemText, IconButton,
  CircularProgress, Alert, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function UsuariosPage() {
  const { token } = useContext(AuthContext);
  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', tipo: 'aluno', departamento_id: '' });
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsuarios = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/usuarios', {
      headers: { 'x-access-token': token }
    })
    .then(res => res.json())
    .then(data => {
      setUsuarios(data);
      setLoading(false);
    })
    .catch(err => {
      setError('Falha ao carregar usuários.');
      setLoading(false);
    });
  };

  useEffect(() => {
    if(token) fetchUsuarios();
  }, [token]);

  const handleCreateClick = () => {
    setEditingUser(null);
    setFormData({ nome: '', email: '', senha: '', tipo: 'aluno', departamento_id: '' });
    setOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ 
      nome: user.nome, 
      email: user.email,
      tipo: user.tipo,
      departamento_id: user.departamento_id || '',
      senha: '' // <-- Pequeno ajuste: garante que o campo de senha comece vazio na edição
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const isEditing = editingUser !== null;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:5000/api/usuarios/${editingUser.usuario_id}`
      : 'http://localhost:5000/api/usuarios';

    const finalFormData = {
      ...formData,
      departamento_id: formData.departamento_id ? parseInt(formData.departamento_id) : null
    };
    
    // --- CORREÇÃO PRINCIPAL: A linha que deletava a senha foi removida daqui ---

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify(finalFormData)
    })
    .then(res => {
      if (!res.ok) throw new Error(isEditing ? 'Falha ao atualizar usuário' : 'Falha ao criar usuário');
      return res.json();
    })
    .then(() => {
      handleClose();
      fetchUsuarios();
    })
    .catch(err => {
        setError(err.message);
        setTimeout(() => setError(null), 5000);
    });
  };

  const handleDelete = (userId) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      fetch(`http://localhost:5000/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao deletar usuário.');
        fetchUsuarios();
      })
      .catch(err => setError(err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Usuários
      </Typography>

      <Button variant="contained" color="primary" onClick={handleCreateClick} sx={{ mb: 2 }}>
        Adicionar Novo Usuário
      </Button>

      {loading && <CircularProgress />}
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      
      {!loading && !error && (
        <List>
          {usuarios.map(user => (
            <ListItem key={user.usuario_id} secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(user.usuario_id)} sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </>
            }>
              <ListItemText 
                primary={`${user.nome} (${user.tipo})`} 
                secondary={
                    <>
                        <Typography component="span" variant="body2" color="text.primary">
                            Email: {user.email}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                            Departamento: {user.departamento_nome || 'N/A'}
                        </Typography>
                    </>
                } 
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editingUser ? 'Altere os dados do usuário. Deixe a senha em branco para não alterá-la.' : 'Preencha os dados para criar um novo usuário. A senha é obrigatória na criação.'}
          </DialogContentText>
          <TextField autoFocus margin="dense" name="nome" label="Nome Completo" type="text" fullWidth variant="standard" value={formData.nome} onChange={handleInputChange} />
          <TextField margin="dense" name="email" label="E-mail" type="email" fullWidth variant="standard" value={formData.email} onChange={handleInputChange} />
          <TextField margin="dense" name="senha" label={editingUser ? "Nova Senha (opcional)" : "Senha"} type="password" fullWidth variant="standard" value={formData.senha} onChange={handleInputChange} />
          <TextField margin="dense" name="tipo" label="Tipo (aluno, professor, gestor)" type="text" fullWidth variant="standard" value={formData.tipo} onChange={handleInputChange} />
          <TextField margin="dense" name="departamento_id" label="ID do Departamento (opcional)" type="number" fullWidth variant="standard" value={formData.departamento_id} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UsuariosPage;