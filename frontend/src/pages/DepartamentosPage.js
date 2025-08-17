import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Typography, Container, List, ListItem, ListItemText, IconButton,
  CircularProgress, Alert, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function DepartamentosPage() {
  const { user, token } = useContext(AuthContext);
  const isGestor = user?.tipo === 'gestor';

  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o modal de Adicionar/Editar
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '' });
  const [editingDepto, setEditingDepto] = useState(null);

  const fetchDepartamentos = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/departamentos')
      .then(res => res.json())
      .then(data => {
        setDepartamentos(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Falha ao carregar departamentos');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const handleCreateClick = () => {
    setEditingDepto(null);
    setFormData({ nome: '' });
    setOpen(true);
  };

  const handleEditClick = (depto) => {
    setEditingDepto(depto);
    setFormData({ nome: depto.nome });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleInputChange = (e) => setFormData({ nome: e.target.value });

  const handleSubmit = () => {
    const isEditing = editingDepto !== null;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:5000/api/departamentos/${editingDepto.departamento_id}`
      : 'http://localhost:5000/api/departamentos';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-access-token': token },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error(isEditing ? 'Falha ao atualizar' : 'Falha ao criar');
      return res.json();
    })
    .then(() => {
      handleClose();
      fetchDepartamentos();
    })
    .catch(err => setError(err.message));
  };

  const handleDelete = (deptoId) => {
    if (window.confirm('Tem certeza? Deletar um departamento pode falhar se ele estiver em uso.')) {
      fetch(`http://localhost:5000/api/departamentos/${deptoId}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao deletar');
        fetchDepartamentos();
      })
      .catch(err => setError(err.message));
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Departamentos
      </Typography>

      {isGestor && (
        <Button variant="contained" color="primary" onClick={handleCreateClick} sx={{ mb: 2 }}>
          Adicionar Novo Departamento
        </Button>
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <List>
          {departamentos.map(depto => (
            <ListItem key={depto.departamento_id} secondaryAction={
              isGestor && (
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(depto)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(depto.departamento_id)} sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }>
              <ListItemText primary={depto.nome} secondary={`ID: ${depto.departamento_id}`} />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingDepto ? 'Editar Departamento' : 'Adicionar Novo Departamento'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="nome" label="Nome do Departamento" type="text" fullWidth variant="standard" value={formData.nome} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DepartamentosPage;