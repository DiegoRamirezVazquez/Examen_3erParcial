
import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  BookOpen,
  ClipboardList,
  CalendarDays,
  LogOut,
  Bell,
  ChevronRight
} from "lucide-react";

import "./Dashboard.css";

function Dashboard({ student, onLogout }) {

  // Adaptamos la información que devuelve nuestro backend.
  const nombre =
    student?.nombre ||
    student?.name ||
    student?.estudiante?.nombre ||
    "Estudiante";

  const matricula =
    student?.matricula ||
    student?.no_control ||
    student?.numero_control ||
    "Información no disponible";

  const carrera =
    student?.carrera ||
    student?.especialidad ||
    "Carrera no disponible";

  return (
    <div className="dashboard">

      {/* MENÚ LATERAL */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <GraduationCap size={25} />
          </div>

          <div>
            <h2>Portal Académico</h2>
            <span>TecNM Celaya</span>
          </div>
        </div>

        <p className="menu-label">MENÚ PRINCIPAL</p>

        <nav className="sidebar-nav">

          <a className="nav-link active" href="#inicio">
            <LayoutDashboard size={19} />
            <span>Inicio</span>
          </a>

          <a className="nav-link" href="#perfil">
            <UserRound size={19} />
            <span>Mi perfil</span>
          </a>

          <a className="nav-link" href="#calificaciones">
            <BookOpen size={19} />
            <span>Calificaciones</span>
          </a>

          <a className="nav-link" href="#kardex">
            <ClipboardList size={19} />
            <span>Kardex</span>
          </a>

          <a className="nav-link" href="#horarios">
            <CalendarDays size={19} />
            <span>Horarios</span>
          </a>

        </nav>

        <div className="sidebar-bottom">
          <button className="logout-button" onClick={onLogout}>
            <LogOut size={19} />
            <span>Cerrar sesión</span>
          </button>
        </div>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-main" id="inicio">

        <header className="dashboard-header">

          <div>
            <p className="header-subtitle">ESPACIO ESTUDIANTIL</p>
            <h1>Panel principal</h1>
          </div>

          <button className="notification-button" aria-label="Notificaciones">
            <Bell size={20} />
          </button>

        </header>

        {/* BIENVENIDA */}
        <section className="welcome-card">

          <div>
            <span className="welcome-tag">PORTAL ESTUDIANTIL</span>

            <h2>¡Hola, {nombre}!</h2>

            <p>
              Bienvenido a tu espacio académico.
              Aquí podrás consultar y organizar tu información escolar.
            </p>
          </div>

          <div className="welcome-icon">
            <GraduationCap size={65} strokeWidth={1.3} />
          </div>

        </section>

        {/* PERFIL */}
        <section className="section-container" id="perfil">

          <div className="section-heading">
            <div>
              <h2>Mi información</h2>
              <p>Datos de tu cuenta institucional</p>
            </div>
          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              <UserRound size={30} />
            </div>

            <div className="profile-information">
              <h3>{nombre}</h3>
              <p>Estudiante del Instituto Tecnológico de Celaya</p>

              <div className="profile-details">
                <span>
                  <strong>Matrícula:</strong> {matricula}
                </span>

                <span>
                  <strong>Carrera:</strong> {carrera}
                </span>
              </div>
            </div>

          </div>

        </section>

        {/* ACCESOS ACADÉMICOS */}
        <section className="section-container">

          <div className="section-heading">
            <div>
              <h2>Mi espacio académico</h2>
              <p>Accede rápidamente a tus servicios escolares</p>
            </div>
          </div>

          <div className="academic-grid">

            <article className="academic-card" id="calificaciones">
              <div className="academic-icon blue">
                <BookOpen size={25} />
              </div>

              <h3>Calificaciones</h3>
              <p>Consulta tus resultados académicos.</p>

              <span className="card-link">
                Consultar <ChevronRight size={16} />
              </span>
            </article>

            <article className="academic-card" id="kardex">
              <div className="academic-icon purple">
                <ClipboardList size={25} />
              </div>

              <h3>Kardex</h3>
              <p>Revisa tu historial académico.</p>

              <span className="card-link">
                Consultar <ChevronRight size={16} />
              </span>
            </article>

            <article className="academic-card" id="horarios">
              <div className="academic-icon green">
                <CalendarDays size={25} />
              </div>

              <h3>Horarios</h3>
              <p>Organiza tus actividades escolares.</p>

              <span className="card-link">
                Consultar <ChevronRight size={16} />
              </span>
            </article>

          </div>

        </section>

        <footer className="dashboard-footer">
          Tecnológico Nacional de México · Instituto Tecnológico de Celaya
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
