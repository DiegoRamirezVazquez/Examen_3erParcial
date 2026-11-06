// ==========================================
// VALIDACIONES DEL FORMULARIO DE LOGIN
// ==========================================

// Cambia este dominio si tu institución usa otro.
export const DOMINIO_INSTITUCIONAL = "@celaya.tecnm.mx";

export const MAX_EMAIL = 100;
export const MAX_PASSWORD = 128;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida el correo institucional.
 * @param {string} email
 * @returns {string} Mensaje de error, o "" si es válido.
 */
export function validarEmail(email) {
  const correo = email.trim();

  if (!correo) {
    return "Ingresa tu correo institucional.";
  }

  if (correo.length > MAX_EMAIL) {
    return `El correo no puede superar ${MAX_EMAIL} caracteres.`;
  }

  if (!EMAIL_REGEX.test(correo)) {
    return "El correo no tiene un formato válido.";
  }

  if (!correo.toLowerCase().endsWith(DOMINIO_INSTITUCIONAL)) {
    return `Usa tu cuenta institucional (${DOMINIO_INSTITUCIONAL}).`;
  }

  return "";
}

/**
 * Valida la contraseña.
 * @param {string} password
 * @returns {string} Mensaje de error, o "" si es válida.
 */
export function validarPassword(password) {
  if (!password) {
    return "Ingresa tu contraseña.";
  }

  if (password.length > MAX_PASSWORD) {
    return `La contraseña no puede superar ${MAX_PASSWORD} caracteres.`;
  }

  return "";
}

/**
 * Valida todos los campos del login.
 * @returns {{ email?: string, password?: string }} Solo incluye los campos con error.
 */
export function validarCampos(email, password) {
  const errores = {};

  const errorEmail = validarEmail(email);
  if (errorEmail) errores.email = errorEmail;

  const errorPassword = validarPassword(password);
  if (errorPassword) errores.password = errorPassword;

  return errores;
}