import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  TextField,
  Box,
  Chip,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function ReservasPage() {
  const { user, token } = useContext(AuthContext);
  const isGestor = user?.tipo === "gestor";

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allUsuarios, setAllUsuarios] = useState([]);
  const [allEspacos, setAllEspacos] = useState([]);

  const [filtros, setFiltros] = useState({
    solicitante_id: "",
    espaco_id: "",
    status: "",
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState({
    espaco_id: null,
    finalidade: "",
    num_participantes: "",
    data_hora_inicio: "",
    data_hora_fim: "",
  });

  const [horariosOcupados, setHorariosOcupados] = useState([]);

  const fetchReservas = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filtros.solicitante_id)
      params.append("solicitante_id", filtros.solicitante_id);
    if (filtros.espaco_id) params.append("espaco_id", filtros.espaco_id);
    if (filtros.status) params.append("status", filtros.status);

    if (user && user.tipo !== "gestor") {
      params.set("solicitante_id", user.usuario_id);
    }

    fetch(`http://localhost:5000/api/reservas?${params.toString()}`, {
      headers: { "x-access-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        setReservas(data);
      })
      .catch((err) => {
        setError("Falha ao carregar reservas.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!token) return;

    const fetchInitialData = async () => {
      try {
        const [usuariosRes, espacosRes] = await Promise.all([
          fetch("http://localhost:5000/api/usuarios", {
            headers: { "x-access-token": token },
          }),
          fetch("http://localhost:5000/api/espacos"),
        ]);
        setAllUsuarios(await usuariosRes.json());
        setAllEspacos(await espacosRes.json());
      } catch (err) {
        setError("Falha ao carregar dados de apoio.");
      }
    };

    fetchInitialData();
  }, [token]);

  useEffect(() => {
    if (token && user) {
      fetchReservas();
    }
  }, [token, user, filtros]);

  const handleOpenCreateModal = () => {
    setFormData({
      espaco_id: null,
      finalidade: "",
      num_participantes: "",
      data_hora_inicio: "",
      data_hora_fim: "",
    });
    setHorariosOcupados([]);
    setOpenCreate(true);
  };
  const handleCloseCreateModal = () => setOpenCreate(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      espaco_id: value ? value.espaco_id : null,
    }));
    if (value) {
      const statusFilter = "pendente,confirmada";
      fetch(
        `http://localhost:5000/api/reservas?espaco_id=${value.espaco_id}&status=${statusFilter}`,
        {
          headers: { "x-access-token": token },
        }
      )
        .then((res) => res.json())
        .then((data) => setHorariosOcupados(data))
        .catch(() => setHorariosOcupados([]));
    } else {
      setHorariosOcupados([]);
    }
  };

  const handleCreateSubmit = () => {
    fetch("http://localhost:5000/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify({
        ...formData,
        num_participantes: parseInt(formData.num_participantes),
      }),
    })
      .then((res) =>
        res.json().then((data) => {
          if (!res.ok) throw new Error(data.erro || "Falha ao criar reserva.");
          return data;
        })
      )
      .then(() => {
        handleCloseCreateModal();
        fetchReservas();
      })
      .catch((err) => {
        setError(err.message);
        setTimeout(() => setError(null), 5000);
      });
  };

  const handleUpdateStatus = (reservaId, newStatus) => {
    fetch(`http://localhost:5000/api/reservas/${reservaId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao atualizar status da reserva.");
        fetchReservas();
      })
      .catch((err) => setError(err.message));
  };

  const handleCancel = (reservaId) => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      fetch(`http://localhost:5000/api/reservas/${reservaId}`, {
        method: "DELETE",
        headers: {
          // Apenas o token é necessário para o back-end saber quem está cancelando
          "x-access-token": token,
        },
      })
        .then((res) =>
          res.json().then((data) => {
            if (!res.ok)
              throw new Error(data.erro || "Falha ao cancelar reserva.");
            fetchReservas(); // Atualiza a lista após o cancelamento
          })
        )
        .catch((err) => {
          setError(err.message);
          setTimeout(() => setError(null), 5000);
        });
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "confirmada":
        return "success";
      case "pendente":
        return "warning";
      case "recusada":
        return "error";
      case "cancelada":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          {isGestor ? "Gerenciamento de Reservas" : "Minhas Reservas"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateModal}
        >
          Nova Reserva
        </Button>
      </Box>

      {isGestor && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Autocomplete
                options={allUsuarios}
                getOptionLabel={(option) => option.nome || ""}
                onChange={(event, newValue) =>
                  setFiltros((prev) => ({
                    ...prev,
                    solicitante_id: newValue ? newValue.usuario_id : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Solicitante" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Autocomplete
                options={allEspacos}
                getOptionLabel={(option) => option.nome || ""}
                onChange={(event, newValue) =>
                  setFiltros((prev) => ({
                    ...prev,
                    espaco_id: newValue ? newValue.espaco_id : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Espaço" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={filtros.status}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, status: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <List>
          {reservas.length > 0 ? (
            reservas.map((reserva) => (
              <ListItem
                key={reserva.reserva_id}
                divider
                secondaryAction={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={reserva.status}
                      color={getStatusChipColor(reserva.status)}
                    />
                    {isGestor && reserva.status === "pendente" && (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="aprovar"
                          onClick={() =>
                            handleUpdateStatus(reserva.reserva_id, "confirmada")
                          }
                          title="Aprovar"
                        >
                          <CheckCircleIcon color="success" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="recusar"
                          onClick={() =>
                            handleUpdateStatus(reserva.reserva_id, "recusada")
                          }
                          title="Recusar"
                        >
                          <CancelIcon color="error" />
                        </IconButton>
                      </>
                    )}
                    {user.usuario_id === reserva.solicitante_id &&
                      (reserva.status === "pendente" ||
                        reserva.status === "confirmada") &&
                      new Date(reserva.data_hora_inicio) > new Date() && (
                        <IconButton
                          edge="end"
                          aria-label="cancelar"
                          onClick={() => handleCancel(reserva.reserva_id)}
                          title="Cancelar Reserva"
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      )}
                  </Box>
                }
              >
                <ListItemText
                  primary={`${reserva.espaco_nome} - ${
                    reserva.finalidade || "Sem finalidade"
                  }`}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        display="block"
                      >
                        Solicitante: {reserva.solicitante_nome}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        display="block"
                      >
                        Início:{" "}
                        {new Date(reserva.data_hora_inicio).toLocaleString(
                          "pt-BR"
                        )}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        display="block"
                      >
                        Fim:{" "}
                        {new Date(reserva.data_hora_fim).toLocaleString(
                          "pt-BR"
                        )}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ mt: 2 }}>Nenhuma reserva encontrada.</Typography>
          )}
        </List>
      )}

      <Dialog
        open={openCreate}
        onClose={handleCloseCreateModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Solicitar Nova Reserva</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={allEspacos}
            getOptionLabel={(option) => option.nome || ""}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Espaço"
                margin="normal"
                fullWidth
                variant="outlined"
              />
            )}
          />

          {horariosOcupados.length > 0 && (
            <Paper
              variant="outlined"
              sx={{ p: 2, mt: 2, maxHeight: 150, overflow: "auto" }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Horários já agendados para este espaço:
              </Typography>
              <List dense>
                {horariosOcupados.map((res) => (
                  <ListItem key={res.reserva_id}>
                    <ListItemText
                      primary={`${new Date(
                        res.data_hora_inicio
                      ).toLocaleDateString("pt-BR")} - de ${new Date(
                        res.data_hora_inicio
                      ).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} até ${new Date(res.data_hora_fim).toLocaleTimeString(
                        "pt-BR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}`}
                      secondary={`Status: ${res.status}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          <TextField
            name="finalidade"
            label="Finalidade"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.finalidade}
            onChange={handleFormChange}
          />
          <TextField
            name="num_participantes"
            label="Nº de Participantes"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.num_participantes}
            onChange={handleFormChange}
          />
          <TextField
            name="data_hora_inicio"
            label="Início da Reserva"
            type="datetime-local"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.data_hora_inicio}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="data_hora_fim"
            label="Fim da Reserva"
            type="datetime-local"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.data_hora_fim}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateModal}>Cancelar</Button>
          <Button onClick={handleCreateSubmit}>Solicitar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ReservasPage;
