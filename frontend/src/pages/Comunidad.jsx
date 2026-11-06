import { useEffect, useState } from "react";

import {
  Send,
  MessageCircle,
  Users,
  RefreshCw,
  Heart,
  Trash2
} from "lucide-react";

import {
  obtenerPublicaciones,
  crearPublicacion
} from "../services/comunidadService";

import {
  obtenerComentarios,
  crearComentario,
  eliminarComentario
} from "../services/comentarioService";

import {
  agregarReaccion,
  quitarReaccion
} from "../services/reaccionService";

import "./Comunidad.css";

function Comunidad({ csrfToken }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("General");

  const [cargando, setCargando] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [comentarios, setComentarios] = useState({});
  const [comentariosAbiertos, setComentariosAbiertos] = useState({});
  const [nuevosComentarios, setNuevosComentarios] = useState({});
  const [cargandoComentarios, setCargandoComentarios] = useState({});
  const [enviandoComentario, setEnviandoComentario] = useState({});

  const [procesandoReaccion, setProcesandoReaccion] = useState({});
  const [eliminandoComentario, setEliminandoComentario] = useState({});


    // Consultar publicaciones
  const cargarPublicaciones = async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await obtenerPublicaciones();
      setPublicaciones(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No fue posible cargar las publicaciones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  // Crear publicación
  const handlePublicar = async (e) => {
    e.preventDefault();

    if (!contenido.trim()) {
      setError("Escribe algo antes de publicar.");
      return;
    }

    setPublicando(true);
    setError("");
    setMensaje("");

    try {
      await crearPublicacion(
        contenido.trim(),
        categoria,
        csrfToken
      );

      setContenido("");
      setCategoria("General");

      setMensaje("¡Tu publicación se creó correctamente!");

      await cargarPublicaciones();

    } catch (err) {
      setError(err.message || "No fue posible crear la publicación.");
    } finally {
      setPublicando(false);
    }
  };


  // Consultar comentarios de una publicación
  const cargarComentarios = async (publicacionId) => {
    setCargandoComentarios((prev) => ({
      ...prev,
      [publicacionId]: true
    }));

    try {
      const respuesta = await obtenerComentarios(publicacionId);

      setComentarios((prev) => ({
        ...prev,
        [publicacionId]: respuesta.data || []
      }));
    } catch (err) {
      setError(err.message || "No fue posible cargar los comentarios.");
    } finally {
      setCargandoComentarios((prev) => ({
        ...prev,
        [publicacionId]: false
      }));
    }
  };

  // Abrir o cerrar comentarios
  const alternarComentarios = async (publicacionId) => {
    const abierto = comentariosAbiertos[publicacionId];

    setComentariosAbiertos((prev) => ({
      ...prev,
      [publicacionId]: !abierto
    }));

    if (!abierto && !comentarios[publicacionId]) {
      await cargarComentarios(publicacionId);
    }
  };

  // Publicar un comentario
  const handleComentar = async (e, publicacionId) => {
    e.preventDefault();

    const texto = (nuevosComentarios[publicacionId] || "").trim();

    if (!texto) return;

    setEnviandoComentario((prev) => ({
      ...prev,
      [publicacionId]: true
    }));

    setError("");

    try {
      await crearComentario(publicacionId, texto, csrfToken);

      setNuevosComentarios((prev) => ({
        ...prev,
        [publicacionId]: ""
      }));

      await cargarComentarios(publicacionId);

    } catch (err) {
      setError(err.message || "No fue posible publicar el comentario.");
    } finally {
      setEnviandoComentario((prev) => ({
        ...prev,
        [publicacionId]: false
      }));
    }
  };

// Eliminar comentario propio
const handleEliminarComentario = async (comentario, publicacionId) => {
  const confirmar = window.confirm(
    "¿Estás seguro de que deseas eliminar este comentario?"
  );

  if (!confirmar) return;

  setEliminandoComentario((prev) => ({
    ...prev,
    [comentario.id]: true
  }));

  setError("");

  try {
    await eliminarComentario(comentario.id, csrfToken);

    setComentarios((prev) => ({
      ...prev,
      [publicacionId]: (prev[publicacionId] || []).filter(
        (item) => item.id !== comentario.id
      )
    }));

  } catch (err) {
    setError(err.message || "No fue posible eliminar el comentario.");
  } finally {
    setEliminandoComentario((prev) => ({
      ...prev,
      [comentario.id]: false
    }));
  }
};

  // Agregar o quitar reacción
const handleReaccion = async (publicacion) => {
  const publicacionId = publicacion.id;

  if (procesandoReaccion[publicacionId]) return;

  const yaReacciono = publicacion.usuario_reacciono;

  setProcesandoReaccion((prev) => ({
    ...prev,
    [publicacionId]: true
  }));

  try {
    if (yaReacciono) {
      await quitarReaccion(publicacionId, csrfToken);
    } else {
      await agregarReaccion(publicacionId, csrfToken);
    }

    setPublicaciones((prev) =>
      prev.map((item) =>
        item.id === publicacionId
          ? {
              ...item,
              usuario_reacciono: !yaReacciono,
              total_reacciones: Math.max(
                0,
                Number(item.total_reacciones || 0) +
                  (yaReacciono ? -1 : 1)
              )
            }
          : item
      )
    );

  } catch (err) {
    setError(err.message || "No fue posible actualizar la reacción.");
  } finally {
    setProcesandoReaccion((prev) => ({
      ...prev,
      [publicacionId]: false
    }));
  }
};

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <section className="community-page">

      {/* ENCABEZADO */}
      <header className="community-header">
        <div>
          <span className="community-tag">
            ESPACIO ESTUDIANTIL
          </span>

          <h1>Comunidad estudiantil</h1>

          <p>
            Comparte ideas, resuelve dudas y conecta
            con otros estudiantes.
          </p>
        </div>

        <div className="community-header-icon">
          <Users size={35} />
        </div>
      </header>

      {/* FORMULARIO DE PUBLICACIÓN */}
      <section className="community-composer">

        <div className="composer-heading">
          <h2>¿Qué quieres compartir?</h2>
          <p>Tu comunidad está lista para escucharte.</p>
        </div>

        <form onSubmit={handlePublicar}>

          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Comparte una idea, pregunta o experiencia..."
            maxLength={5000}
            rows={5}
            disabled={publicando}
          />

          <div className="composer-footer">

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              disabled={publicando}
            >
              <option value="General">General</option>
              <option value="Dudas académicas">Dudas académicas</option>
              <option value="Proyectos">Proyectos</option>
              <option value="Material de estudio">Material de estudio</option>
              <option value="Avisos">Avisos</option>
              <option value="Eventos">Eventos</option>
            </select>

            <span className="character-count">
              {contenido.length}/5000
            </span>

            <button
              type="submit"
              disabled={publicando || !contenido.trim()}
              className="publish-button"
            >
              <Send size={17} />
              {publicando ? "Publicando..." : "Publicar"}
            </button>

          </div>

        </form>

      </section>

      {/* MENSAJES */}
      {error && (
        <div className="community-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="community-success">
          {mensaje}
        </div>
      )}

      {/* PUBLICACIONES */}
      <section className="community-feed">

        <div className="feed-heading">
          <div>
            <h2>Publicaciones</h2>
            <p>Lo que está pasando en la comunidad.</p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={cargarPublicaciones}
            disabled={cargando}
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        </div>

        {cargando ? (
          <div className="community-empty">
            Cargando publicaciones...
          </div>
        ) : publicaciones.length === 0 ? (

          <div className="community-empty">
            <MessageCircle size={35} />

            <h3>Aún no hay publicaciones</h3>

            <p>
              ¡Sé el primero en compartir algo con la comunidad!
            </p>
          </div>

        ) : (

          <div className="publications-list">

            {publicaciones.map((publicacion) => (

              <article
                className="publication-card"
                key={publicacion.id}
              >

                <div className="publication-top">
                  <div className="publication-avatar">
                    {publicacion.foto_url ? (
                      <img
                        src={publicacion.foto_url}
                        alt={`Fotografía de ${publicacion.nombre || "Estudiante"}`}
                      />
                    ) : (
                      <Users size={21} />
                    )}
                  </div>

                  <div className="publication-author">
                    <strong>
                       {publicacion.nombre || "Estudiante"}
                    </strong>

                    <span>
                      {formatearFecha(publicacion.fecha_creacion)}
                    </span>
                  </div>

                  <span className="publication-category">
                    {publicacion.categoria}
                  </span>
                </div>

                <p className="publication-content">
                  {publicacion.contenido}
                </p>

                {/* ACCIONES DE LA PUBLICACIÓN */}
                <div className="publication-actions">

                  <button
                    type="button"
                    className={`reaction-button ${
                      publicacion.usuario_reacciono ? "reacted" : ""
                    }`}
                    onClick={() => handleReaccion(publicacion)}
                    disabled={procesandoReaccion[publicacion.id]}
                  >
                    <Heart
                      size={19}
                      fill={publicacion.usuario_reacciono ? "currentColor" : "none"}
                    />

                    <span>
                      {publicacion.usuario_reacciono ? "Te gusta" : "Me gusta"}
                    </span>

                    <strong>
                      {Number(publicacion.total_reacciones || 0)}
                    </strong>
                  </button>

                </div>

                {/* SECCIÓN DE COMENTARIOS */}
                <div className="publication-comments">

                  <button
                    type="button"
                    className="comments-toggle"
                    onClick={() => alternarComentarios(publicacion.id)}
                  >
                    <MessageCircle size={17} />

                    {comentariosAbiertos[publicacion.id]
                      ? "Ocultar comentarios"
                      : "Ver comentarios"}

                    {comentarios[publicacion.id] && (
                      <span>
                        ({comentarios[publicacion.id].length})
                      </span>
                    )}
                  </button>

                  {comentariosAbiertos[publicacion.id] && (
                    <div className="comments-content">

                      {cargandoComentarios[publicacion.id] ? (
                        <p className="comments-loading">
                          Cargando comentarios...
                        </p>
                      ) : comentarios[publicacion.id]?.length > 0 ? (

                        <div className="comments-list">

                          {comentarios[publicacion.id].map((comentario) => (
                            <div className="comment-item" key={comentario.id}>

                              <div className="comment-avatar">
                                {comentario.foto_url ? (
                                  <img
                                    src={comentario.foto_url}
                                    alt={`Fotografía de ${comentario.nombre}`}
                                  />
                                ) : (
                                  <Users size={17} />
                                )}
                              </div>

                              <div className="comment-body">

                                <div className="comment-author">
                                  <strong>
                                    {comentario.nombre || "Estudiante"}
                                  </strong>

                                  <span>
                                    {formatearFecha(comentario.fecha_creacion)}
                                  </span>

                                  {comentario.es_autor && (
                                    <button
                                      type="button"
                                      className="delete-comment-button"
                                      onClick={() =>
                                        handleEliminarComentario(comentario, publicacion.id)
                                      }
                                      disabled={eliminandoComentario[comentario.id]}
                                      title="Eliminar mi comentario"
                                    >
                                      <Trash2 size={15} />

                                      {eliminandoComentario[comentario.id]
                                        ? "Eliminando..."
                                        : "Eliminar"}
                                    </button>
                                  )}
                                </div>

                                <p>{comentario.contenido}</p>

                              </div>

                            </div>
                          ))}

                        </div>

                      ) : (
                        <p className="comments-empty">
                          Aún no hay comentarios. ¡Sé el primero!
                        </p>
                      )}

                      <form
                        className="comment-form"
                        onSubmit={(e) => handleComentar(e, publicacion.id)}
                      >

                        <textarea
                          value={nuevosComentarios[publicacion.id] || ""}
                          onChange={(e) =>
                            setNuevosComentarios((prev) => ({
                              ...prev,
                              [publicacion.id]: e.target.value
                            }))
                          }
                          placeholder="Escribe un comentario..."
                          maxLength={2000}
                          rows={2}
                          disabled={enviandoComentario[publicacion.id]}
                        />

                        <button
                          type="submit"
                          disabled={
                            enviandoComentario[publicacion.id] ||
                            !(nuevosComentarios[publicacion.id] || "").trim()
                          }
                        >
                          <Send size={16} />
                          {enviandoComentario[publicacion.id]
                            ? "Enviando..."
                            : "Comentar"}
                        </button>

                      </form>

                    </div>
                  )}

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </section>
  );
}

export default Comunidad;
