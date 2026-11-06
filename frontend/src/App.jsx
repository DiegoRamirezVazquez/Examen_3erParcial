import { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import LogosCarrusel from "./components/logoCarrusel";

import {
  obtenerCSRF,
  iniciarSesion,
  obtenerPerfil,
  cerrarSesion
} from "./services/authService";

import {
  validarCampos,
  MAX_EMAIL,
  MAX_PASSWORD
} from "../../backend/src/utils/Validaciones.js";

import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [capsLock, setCapsLock] = useState(false);

  // Campos que el usuario ya tocó (para no mostrar errores antes de tiempo).
  const [touched, setTouched] = useState({ email: false, password: false });

  const [authenticated, setAuthenticated] = useState(false);
  const [student, setStudent] = useState(null);

  // CSRF permanece únicamente en memoria.
  const [csrfToken, setCsrfToken] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Errores calculados en cada render a partir de los valores actuales.
  const errores = validarCampos(email, password);
  const mostrarError = {
    email: touched.email && errores.email,
    password: touched.password && errores.password
  };

  const marcarTocado = (campo) =>
    setTouched((prev) => ({ ...prev, [campo]: true }));

  const detectarMayusculas = (e) => {
    setCapsLock(e.getModifierState && e.getModifierState("CapsLock"));
  };

  // ==========================================
  // RECUPERAR SESIÓN AL CARGAR LA APLICACIÓN
  // ==========================================

  useEffect(() => {
    const comprobarSesion = async () => {
      try {
        const csrf = await obtenerCSRF();
        setCsrfToken(csrf.csrfToken);

        const perfil = await obtenerPerfil();
        const datosEstudiante = perfil.data?.data;

        if (!datosEstudiante) {
          throw new Error("No se encontraron los datos del estudiante.");
        }

        setStudent(datosEstudiante);
        setAuthenticated(true);
      } catch {
        setStudent(null);
        setAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    };

    comprobarSesion();
  }, []);

  // ==========================================
  // INICIAR SESIÓN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // evita envíos duplicados

    setError("");

    // Validar antes de enviar al servidor.
    setTouched({ email: true, password: true });

    if (errores.email) {
      emailRef.current?.focus();
      return;
    }

    if (errores.password) {
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      // Obtener CSRF anónimo.
      const csrf = await obtenerCSRF();

      // Autenticar contra nuestro backend.
      await iniciarSesion(
        email.trim().toLowerCase(),
        password,
        csrf.csrfToken
      );

      // Obtener un nuevo CSRF asociado a la sesión.
      const nuevoCSRF = await obtenerCSRF();
      setCsrfToken(nuevoCSRF.csrfToken);

      // Consultar perfil.
      const perfil = await obtenerPerfil();
      const datosEstudiante = perfil.data?.data;

      if (!datosEstudiante) {
        throw new Error("No se encontraron los datos del estudiante.");
      }

      setStudent(datosEstudiante);
      setAuthenticated(true);
      setPassword("");
      setTouched({ email: false, password: false });
    } catch (err) {
      setError(err.message || "No fue posible iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const handleLogout = async () => {
    setError("");

    try {
      await cerrarSesion(csrfToken);

      setCsrfToken("");
      setStudent(null);
      setAuthenticated(false);
      setPassword("");
      setEmail("");
      setTouched({ email: false, password: false });
    } catch (err) {
      setError(err.message || "No se pudo cerrar la sesión.");
    }
  };

  // ==========================================
  // COMPROBANDO SESIÓN
  // ==========================================

  if (checkingSession) {
    return (
      <main className="login-page">
        <p className="checking">Comprobando sesión...</p>
      </main>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  if (authenticated) {
    return (
      <Dashboard
        student={student}
        onLogout={handleLogout}
        csrfToken={csrfToken}
      />
    );
    return <Dashboard student={student} onLogout={handleLogout} />;
  }

  // ==========================================
  // LOGIN
  // ==========================================

  return (
    <main className="login-page">
      <section className="login-card">
        {/* Panel izquierdo: carrusel (donde iba el logo del TecNM) */}
        <div className="logos-container">
          <LogosCarrusel />
        </div>

        {/* Panel derecho: información y formulario originales */}
        <div className="login-container">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap size={40} />
            </div>

            <div>
              <h2>Portal Académico</h2>
              <p>Instituto Tecnológico de Celaya</p>
            </div>
          </div>

          <div className="login-content">
            <div className="welcome-section">
              <span className="tag">PLATAFORMA ESTUDIANTIL</span>

              <h1>
                Tu vida académica,
                <span> en un solo lugar.</span>
              </h1>
            </div>

            {/* noValidate: usamos nuestros propios mensajes en lugar de los del navegador */}
            <form className="login-form" onSubmit={handleLogin} noValidate>
              <div className="input-group">
                <div
                  className={`input-wrapper ${
                    mostrarError.email ? "invalid" : ""
                  }`}
                >
                  <Mail size={19} />

                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="usuario@celaya.tecnm.mx"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onBlur={() => marcarTocado("email")}
                    autoComplete="username"
                    maxLength={MAX_EMAIL + 20}
                    aria-invalid={Boolean(mostrarError.email)}
                    aria-describedby={
                      mostrarError.email ? "email-error" : undefined
                    }
                  />
                </div>
                <label htmlFor="email">Correo institucional</label>
                {mostrarError.email && (
                  <span id="email-error" className="field-error" role="alert">
                    {errores.email}
                  </span>
                )}
              </div>

              <div className="input-group">
                <div
                  className={`input-wrapper ${
                    mostrarError.password ? "invalid" : ""
                  }`}
                >
                  <Lock size={19} />

                  <input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onBlur={() => {
                      marcarTocado("password");
                      setCapsLock(false);
                    }}
                    onKeyUp={detectarMayusculas}
                    onKeyDown={detectarMayusculas}
                    autoComplete="current-password"
                    maxLength={MAX_PASSWORD + 20}
                    aria-invalid={Boolean(mostrarError.password)}
                    aria-describedby={
                      mostrarError.password ? "password-error" : undefined
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
                <label htmlFor="password">Contraseña</label>
                {mostrarError.password && (
                  <span
                    id="password-error"
                    className="field-error"
                    role="alert"
                  >
                    {errores.password}
                  </span>
                )}
                {capsLock && !mostrarError.password && (
                  <span className="field-warning">
                    Bloq Mayús está activado.
                  </span>
                )}
              </div>

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Verificando..." : "Iniciar sesión"}
                {!loading && <ArrowRight size={19} />}
              </button>

              <div className="security-note">
                <Lock size={14} />
                <span>Acceso seguro mediante cuenta institucional</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="login-footer">
        <span>TECNOLÓGICO NACIONAL DE MÉXICO</span>
        <span>© 2026 · Portal Académico</span>
      </footer>
    </main>
  );
}

export default App;