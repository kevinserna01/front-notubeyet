import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ViewProfile.css';

const ViewProfile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userVideos, setUserVideos] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el correo del usuario desde el localStorage
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);

    // Función para obtener los videos subidos por el usuario
    const fetchUserVideos = async () => {
      try {
        const response = await fetch(`https://back-notubeyet.vercel.app/v1/tubeyet/getUserVideos?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setUserVideos(data);
        } else {
          console.error('No se pudieron obtener los videos del usuario');
        }
      } catch (error) {
        console.error('Error al obtener los videos del usuario:', error);
      }
    };

    fetchUserVideos();
  }, []);

  const filteredVideos = userVideos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadClick = () => {
    navigate('/dashboard');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard-main');
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  return (
    <div className="view-profile">
      <header className="profile-header">
        <p className="user-email">Usuario: {userEmail}</p>
        <input
          type="text"
          placeholder="Buscar..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="header-button" onClick={handleUploadClick}>
          Subir video
        </button>
        <button className="header-button" onClick={handleGoToDashboard}>
          Ir al Dashboard
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="video-grid">
        <h2>Mis Videos</h2>
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video._id} className="video-card">
              <video
                width="300"
                height="200"
                controls
                className="video-preview"
              >
                <source src={video.fileUrl} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
              <h3 className="video-title">{video.title}</h3>
              <p className="video-date">
                Subido el: {new Date(video.uploadDate).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No se encontraron videos subidos por este usuario</p>
        )}
      </main>
    </div>
  );
};

export default ViewProfile;
