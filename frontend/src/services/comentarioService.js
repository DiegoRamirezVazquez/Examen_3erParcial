const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function leerRespuesta(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ocurrió un error al procesar los comentarios."
    );
  }

  return data;
}

// Consultar comentarios de una publicación
export async function obtenerComentarios(publicacionId) {
  const response = await fetch(
    `${API_URL}/comentarios/${publicacionId}`,
    {
      method: "GET",
      credentials: "include"
    }
  );

  return leerRespuesta(response);
}

// Crear comentario
export async function crearComentario(
  publicacionId,
  contenido,
  csrfToken
) {
  const response = await fetch(
    `${API_URL}/comentarios/${publicacionId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify({ contenido })
    }
  );

  return leerRespuesta(response);
}

// Eliminar un comentario propio
export async function eliminarComentario(comentarioId, csrfToken) {
  const response = await fetch(
    `${API_URL}/comentarios/comentario/${comentarioId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken
      }
    }
  );

  return leerRespuesta(response);
}
