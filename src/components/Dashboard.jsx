import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './styles/Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(''); // Para la vista previa
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Inicializar el hook navigate

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      window.location.href = '/';
    } else {
      setUserData({
        nombre: userName,
        correo: localStorage.getItem('userEmail'),
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validación de tamaño y tipo de archivo
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // Limitar a 50 MB
        setError('El archivo es demasiado grande. El tamaño máximo permitido es 50MB.');
        setFile(null);
        return;
      }

      if (!selectedFile.type.startsWith('video/')) { // Asegurarse de que es un video
        setError('Solo se pueden cargar archivos de video.');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setFileType(selectedFile.type);
      fileInputRef.current.value = null;
      setError(''); // Limpia errores al seleccionar un nuevo archivo
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setFileType('');
    fileInputRef.current.value = null;
  };

  const renderPreview = () => {
    if (!file) return null;

    if (fileType.includes('image')) {
      return <img src={URL.createObjectURL(file)} alt="Vista previa" className="image-preview" />;
    }
    if (fileType.includes('video')) {
      return <video controls className="video-preview" src={URL.createObjectURL(file)}></video>;
    }
    if (fileType.includes('audio')) {
      return <audio controls className="audio-preview" src={URL.createObjectURL(file)}></audio>;
    }
    return <p>Vista previa no disponible</p>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file) {
      setError('Por favor, completa todos los campos antes de enviar.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('uploadedBy', userData.correo);

    try {
      const response = await fetch('https://back-notubeyet.vercel.app/v1/tubeyet/uploadVideo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setVideoUrl(result.video.fileUrl);
        setFile(null);
        setFileType('');
        setTitle('');
        setDescription('');
        setError('');
        alert('Video subido y guardado con éxito.');
      } else {
        setError(result.error || 'Error desconocido al subir el video.');
      }
    } catch (err) {
      console.error('Error durante la subida:', err);
      setError('Hubo un error al subir el video. Inténtalo nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoToDashboardMain = () => {
    navigate('/dashboard-main'); // Redirige a la ruta dashboard-main
  };

  return (
    <div className="dashboard-container">
      {userData && (
        <>
          <div className="dashboard-header">
            <p>{userData.correo}</p> {/* Solo mostrar el correo */}
          </div>

          <div className="dashboard-content">
            <form onSubmit={handleSubmit} className="dashboard-form">
              <div className="upload-section">
                <label htmlFor="file-upload">Subir un archivo (video, imagen, etc.):</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleFileChange}
                />
                <div className="file-preview">
                  {file ? (
                    <>
                      {renderPreview()}
                      <button type="button" onClick={handleFileRemove} className="remove-button">
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <p style={{ color: '#999' }}>Aquí se mostrará la vista previa del archivo.</p>
                  )}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="title">Título:</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Escribe el título..."
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Descripción:</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe la descripción..."
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="submit-button" disabled={isUploading}>
                {isUploading ? 'Cargando...' : 'Agregar'}
              </button>
            </form>

            <div className="video-preview-container">
              {videoUrl ? (
                <>
                  <h2>Vista previa del video:</h2>
                  <video controls width="600" src={videoUrl}></video>
                  <p>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                      Ver en una nueva pestaña
                    </a>
                  </p>
                </>
              ) : (
                <p style={{ color: '#999' }}>Aquí se mostrará la vista previa del video.</p>
              )}
            </div>

            <div className="go-to-login-section">
              <button className="go-to-login-button" onClick={handleGoToDashboardMain}>
                Volver al dashboard
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
