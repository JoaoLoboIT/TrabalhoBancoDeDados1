import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Box,
} from "@mui/material";

function EspacosPage() {
  const { user, token } = useContext(AuthContext);
  const isGestor = user?.tipo === "gestor";

  const [espacos, setEspacos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availabilityFilters, setAvailabilityFilters] = useState({
    inicio: "",
    fim: "",
    tipo: "",
  });

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    capacidade: "",
  });
  const [editingEspaco, setEditingEspaco] = useState(null);

  const fetchAllEspacos = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/api/espacos")
      .then((response) => {
        if (!response.ok) throw new Error("Falha ao buscar os dados da API");
        return response.json();
      })
      .then((data) => {
        setEspacos(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllEspacos();
  }, []);

  const handleAvailabilityFilterChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchAvailable = () => {
    if (!availabilityFilters.inicio || !availabilityFilters.fim) {
      setError("Por favor, preencha as datas de início e fim para a busca.");
      setTimeout(() => setError(null), 5000);
      return;
    }
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      inicio: availabilityFilters.inicio,
      fim: availabilityFilters.fim,
    });
    if (availabilityFilters.tipo) {
      params.append("tipo", availabilityFilters.tipo);
    }

    fetch(`http://localhost:5000/api/espacos/disponiveis?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar espaços disponíveis.");
        return res.json();
      })
      .then((data) => {
        setEspacos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearFilters = () => {
    setAvailabilityFilters({ inicio: "", fim: "", tipo: "" });
    fetchAllEspacos();
  };

  const handleCreateClick = () => {
    setEditingEspaco(null);
    setFormData({ nome: "", tipo: "", capacidade: "" });
    setOpen(true);
  };

  const handleEditClick = (espaco) => {
    setEditingEspaco(espaco);
    setFormData({
      nome: espaco.nome,
      tipo: espaco.tipo,
      capacidade: espaco.capacidade || "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const isEditing = editingEspaco !== null;
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:5000/api/espacos/${editingEspaco.espaco_id}`
      : "http://localhost:5000/api/espacos";

    const body = {
      ...formData,
      capacidade: parseInt(formData.capacidade, 10) || null,
      gestor_responsavel_id: isEditing
        ? editingEspaco.gestor_responsavel_id
        : user.usuario_id,
    };

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `Falha ao ${isEditing ? "atualizar" : "criar"} o espaço.`
          );
        return res.json();
      })
      .then(() => {
        handleClose();
        fetchAllEspacos();
      })
      .catch((err) => setError(err.message));
  };

  const handleDelete = (espacoId) => {
    if (window.confirm("Tem certeza que deseja deletar este espaço?")) {
      fetch(`http://localhost:5000/api/espacos/${espacoId}`, {
        method: "DELETE",
        headers: { "x-access-token": token },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Falha ao deletar o espaço.");
          return res.json();
        })
        .then(() => fetchAllEspacos())
        .catch((err) => setError(err.message));
    }
  };

  let content;
  if (loading) {
    content = (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else {
    content =
      espacos.length > 0 ? (
        espacos.map((espaco) => (
          <Card
            key={espaco.espaco_id}
            variant="outlined"
            style={{ marginBottom: "10px" }}
          >
            <CardContent>
              <Typography variant="h6">{espaco.nome}</Typography>
              <Typography color="textSecondary">Tipo: {espaco.tipo}</Typography>
              <Typography color="textSecondary">
                Capacidade: {espaco.capacidade || "Não informada"}
              </Typography>
            </CardContent>
            {isGestor && (
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEditClick(espaco)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(espaco.espaco_id)}
                >
                  Deletar
                </Button>
              </CardActions>
            )}
          </Card>
        ))
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhum espaço encontrado para os critérios selecionados.
        </Alert>
      );
  }

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Espaços
      </Typography>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h6" gutterBottom>
          Buscar Espaços Disponíveis
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              name="inicio"
              label="Início"
              type="datetime-local"
              fullWidth
              value={availabilityFilters.inicio}
              onChange={handleAvailabilityFilterChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="fim"
              label="Fim"
              type="datetime-local"
              fullWidth
              value={availabilityFilters.fim}
              onChange={handleAvailabilityFilterChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-filter-label">
                Tipo de Espaço (opcional)
              </InputLabel>
              <Select
                labelId="tipo-filter-label"
                name="tipo"
                value={availabilityFilters.tipo}
                label="Tipo de Espaço (opcional)"
                onChange={handleAvailabilityFilterChange}
              >
                {/* Opção para limpar o filtro e ver todos os tipos */}
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                <MenuItem value="sala_de_aula">Sala de Aula</MenuItem>
                <MenuItem value="laboratorio">Laboratório</MenuItem>
                <MenuItem value="auditorio">Auditório</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Button variant="contained" onClick={handleSearchAvailable}>
                Buscar
              </Button>
              <Button variant="outlined" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {isGestor && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateClick}
          style={{ marginBottom: "20px" }}
        >
          Adicionar Novo Espaço
        </Button>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {content}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingEspaco ? "Editar Espaço" : "Adicionar Novo Espaço"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nome"
            label="Nome do Espaço"
            type="text"
            fullWidth
            variant="standard"
            value={formData.nome}
            onChange={handleInputChange}
          />
          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel id="tipo-select-label">Tipo</InputLabel>
            <Select
              labelId="tipo-select-label"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              label="Tipo"
            >
              <MenuItem value={"sala_de_aula"}>Sala de Aula</MenuItem>
              <MenuItem value={"laboratorio"}>Laboratório</MenuItem>
              <MenuItem value={"auditorio"}>Auditório</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="capacidade"
            label="Capacidade"
            type="number"
            fullWidth
            variant="standard"
            value={formData.capacidade}
            onChange={handleInputChange}
          />
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
