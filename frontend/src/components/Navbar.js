import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, 
  Menu, MenuItem 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para controlar o menu responsivo (hambúrguer)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Espaços', link: '/espacos' },
    { label: 'Departamentos', link: '/departamentos' },
    { label: 'Reservas', link: '/reservas' }
  ];

  if (user?.tipo === 'gestor') {
    menuItems.push({ label: 'Usuários', link: '/usuarios' });
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Sistema de Reservas
        </Typography>

        {user ? (
          <>
            {/* Menu para telas grandes */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button key={item.label} color="inherit" component={RouterLink} to={item.link}>
                  {item.label}
                </Button>
              ))}
              <Typography sx={{ mx: 2 }}>|</Typography>
              <Typography sx={{ mr: 2 }}>
                {user.nome} ({user.tipo})
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Sair
              </Button>
            </Box>

            {/* Menu "Hambúrguer" para telas pequenas */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" color="inherit" onClick={handleMenu}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.label} component={RouterLink} to={item.link} onClick={handleClose}>
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => { handleClose(); handleLogout(); }}>Sair</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;