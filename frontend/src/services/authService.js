const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function leerRespuesta(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Ocurrió un error en el servidor."
    );
  }

  return data;
}

// Obtener protección CSRF
export async function obtenerCSRF() {
  const response = await fetch(`${API_URL}/auth/csrf`, {
    method: "GET",
    credentials: "include"
  });

  return leerRespuesta(response);
}

// Iniciar sesión
export async function iniciarSesion(email, password, csrfToken) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify({ email, password })
  });

  return leerRespuesta(response);
}

// Consultar perfil
export async function obtenerPerfil() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include"
  });

  return leerRespuesta(response);
}

// Cerrar sesión
export async function cerrarSesion(csrfToken) {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken
    }
  });

  return leerRespuesta(response);
}
