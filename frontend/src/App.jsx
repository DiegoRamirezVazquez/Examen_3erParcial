
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

import Dashboard from "./pages/Dashboard";

import {
  obtenerCSRF,
  iniciarSesion,
  obtenerPerfil,
  cerrarSesion
} from "./services/authService";

import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  const [student, setStudent] = useState(null);

  // CSRF permanece únicamente en memoria.
  const [csrfToken, setCsrfToken] = useState("");

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
    setError("");
    setLoading(true);

    try {
      // Obtener CSRF anónimo.
      const csrf = await obtenerCSRF();

      // Autenticar contra nuestro backend.
      await iniciarSesion(email, password, csrf.csrfToken);

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
        <section className="login-container">
          <div className="login-content">
            <p>Comprobando sesión...</p>
          </div>
        </section>
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
  }

  // ==========================================
  // LOGIN
  // ==========================================

  return (
    <main className="login-page">
      <section className="login-container">

        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={30} />
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

            <p>
              Accede a tu información académica,
              consulta tus calificaciones y organiza
              tu trayectoria estudiantil.
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>

            <div className="input-group">
              <label htmlFor="email">Correo institucional</label>

              <div className="input-wrapper">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  placeholder="usuario@celaya.tecnm.mx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>

              <div className="input-wrapper">
                <Lock size={19} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar sesión"}
              {!loading && <ArrowRight size={19} />}
            </button>

            <div className="security-note">
              <Lock size={14} />
              <span>
                Acceso seguro mediante cuenta institucional
              </span>
            </div>

          </form>
        </div>

        <footer className="login-footer">
          <span>TECNOLÓGICO NACIONAL DE MÉXICO</span>
          <span>© 2026 · Portal Académico</span>
        </footer>

      </section>

      <aside className="visual-panel">
        <div className="visual-decoration decoration-one"></div>
        <div className="visual-decoration decoration-two"></div>

        <div className="visual-content">
          <div className="visual-symbol">
            <GraduationCap size={65} strokeWidth={1.3} />
          </div>

          <h2>Tu futuro comienza con conocimiento.</h2>

          <p>
            Una plataforma diseñada para acompañarte
            en cada etapa de tu formación profesional.
          </p>

          <div className="visual-line"></div>

          <span>INSTITUTO TECNOLÓGICO DE CELAYA</span>
        </div>
      </aside>
    </main>
  );
}

export default App;
