const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function leerRespuesta(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ocurrió un error al procesar la reacción."
    );
  }

  return data;
}

// Agregar Me gusta
export async function agregarReaccion(publicacionId, csrfToken) {
  const response = await fetch(
    `${API_URL}/reacciones/${publicacionId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-Token": csrfToken
      }
    }
  );

  return leerRespuesta(response);
}

// Quitar Me gusta
export async function quitarReaccion(publicacionId, csrfToken) {
  const response = await fetch(
    `${API_URL}/reacciones/${publicacionId}`,
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