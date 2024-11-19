import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DashboardMain.css';

const DashboardMain = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]); // Estado para almacenar los videos
  const navigate = useNavigate();

  // Hacer la solicitud para obtener los videos al cargar el componente
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://back-notubeyet.vercel.app/v1/tubeyet/getVideos'); // Ruta para obtener los videos del backend
        if (response.ok) {
          const data = await response.json();
          setVideos(data); // Actualizamos el estado con los videos obtenidos
        } else {
          console.error('No se pudieron obtener los videos');
        }
      } catch (error) {
        console.error('Error al obtener los videos:', error);
      }
    };

    fetchVideos(); // Llamada a la función para obtener los videos
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // Filtrar los videos por el término de búsqueda
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-main">
      <header className="dashboard-header">
        <button className="header-button">Inicio</button>
        <input
          type="text"
          placeholder="Buscar..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="header-button" onClick={handleUploadClick}>Subir video</button>
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <main className="video-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video._id} className="video-card"> {/* Usar _id desde MongoDB */}
              {/* Vista previa del video */}
              <video
                width="300"
                height="200"
                controls
                className="video-preview"
              >
                <source src={video.fileUrl} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
              {/* Información del video */}
              <h3 className="video-title">{video.title}</h3>
              <p className="video-date">
                Subido el: {new Date(video.uploadDate).toLocaleDateString()}
              </p>
              <p className="video-uploader">
                Subido por: <strong>{video.uploadedBy}</strong> {/* Mostrar el correo */}
              </p>
            </div>
          ))
        ) : (
          <p>No se encontraron videos</p>
        )}
      </main>
    </div>
  );
};

export default DashboardMain;
