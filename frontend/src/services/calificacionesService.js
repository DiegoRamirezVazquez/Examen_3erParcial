const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Obtener evaluaciones parciales del periodo actual
export async function obtenerCalificaciones() {
    const response = await fetch(
        `${API_URL}/estudiante/calificaciones`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const resultado = await response.json();

    if (!response.ok) {
        throw new Error(
            resultado.message || "No fue posible obtener las calificaciones."
        );
    }

    return resultado.data?.data || [];
}

export async function obtenerKardex() {
    const response = await fetch(
        `${API_URL}/estudiante/kardex`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const resultado = await response.json();

    if (!response.ok) {
        throw new Error(
            resultado.message || "No fue posible obtener el Kardex."
        );
    }

    return resultado.data?.data?.kardex || [];
}


// Obtener horario del periodo actual
export async function obtenerHorarios() {
    const response = await fetch(
        `${API_URL}/estudiante/horarios`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const resultado = await response.json();

    if (!response.ok) {
        throw new Error(
            resultado.message || "No fue posible obtener los horarios."
        );
    }

    return resultado.data?.data || [];
}