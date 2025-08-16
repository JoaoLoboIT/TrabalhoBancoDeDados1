import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Tenta pegar o token do localStorage ao iniciar
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efeito para buscar os dados do usuário se um token existir no início
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/me', {
            headers: { 'x-access-token': token }
          });
          if (!response.ok) throw new Error('Sessão inválida');
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          // Se o token for inválido, limpa tudo
          logout();
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken); // Salva o token no navegador
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove o token do navegador
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  // Não renderiza a aplicação até que a verificação inicial do token seja feita
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };