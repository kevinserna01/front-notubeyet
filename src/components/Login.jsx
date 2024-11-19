import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css'; // Importar estilos

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { correo, contraseña: password };

    try {
      const response = await fetch('https://back-notubeyet.vercel.app/v1/tubeyet/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el login es exitoso, muestra el mensaje con el nombre del usuario
        alert(data.message); // Mostramos el mensaje de bienvenida con el nombre

        // Almacenar el nombre y correo del usuario en el localStorage
        const userName = data.message.split(' ')[3]; // Aquí extraemos el nombre (a partir de la respuesta del backend)
        const userEmail = correo;

        // Guardar en localStorage
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);

        // Redirigir a DashboardMain
        navigate('/dashboard-main');
      } else {
        // Si ocurre un error en el login
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      alert('Hubo un error al intentar iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido a NotubeYet</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
        <p className="login-footer">
          ¿No tienes cuenta?{' '}
          <span
            onClick={() => navigate('/register')}
            className="login-link"
          >
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
