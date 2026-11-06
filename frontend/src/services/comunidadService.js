const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Leer respuesta del servidor
async function leerRespuesta(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ocurrió un error en el servidor."
    );
  }

  return data;
}

// Consultar publicaciones
export async function obtenerPublicaciones() {
  const response = await fetch(`${API_URL}/comunidad`, {
    method: "GET",
    credentials: "include"
  });

  return leerRespuesta(response);
}

// Crear publicación
export async function crearPublicacion(contenido, categoria, csrfToken) {
  const response = await fetch(`${API_URL}/comunidad`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify({
      contenido,
      categoria
    })
  });

  return leerRespuesta(response);
}
