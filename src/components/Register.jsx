import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import './styles/Register.css'; // Si quieres agregar estilos personalizados

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(''); // Para mostrar errores
  const [successMessage, setSuccessMessage] = useState(''); // Para mostrar éxito

  const navigate = useNavigate(); // Usamos useNavigate para redirigir al menú principal

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://back-notubeyet.vercel.app/v1/tubeyet/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.name,
          correo: formData.email,
          contraseña: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setError('');
        setTimeout(() => {
          navigate('/'); // Redirige al login si el registro fue exitoso
        }, 2000);
      } else {
        setError(data.message);
        setSuccessMessage('');
      }
    } catch (err) {
      setError('Error de red, por favor intenta nuevamente.');
      setSuccessMessage('');
    }
  };

  const handleBack = () => {
    navigate('/'); // Redirige al Login (menú principal)
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Registrar Cuenta</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="register-button">Registrar</button>
            <button type="button" onClick={handleBack} className="register-button">Volver al Menú Principal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
