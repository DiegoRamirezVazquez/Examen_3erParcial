import { useState } from "react";

import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  BookOpen,
  ClipboardList,
  CalendarDays,
  LogOut,
  Bell,
  ChevronRight,
  ArrowLeft,
  Users
} from "lucide-react";

import Calificaciones from "./Calificaciones";
import "./Dashboard.css";
import Kardex from "./Kardex";
import Horarios from "./Horarios";
import Comunidad from "./Comunidad";


function Dashboard({ student, onLogout , csrfToken }) {

  // Controla la pantalla que se encuentra activa.
  const [vistaActual, setVistaActual] = useState("inicio");

  // Información obtenida del SII.
  const nombre = student?.persona || "Estudiante";

  const matricula =
    student?.numero_control || "Información no disponible";

  const correo =
    student?.email || "Correo no disponible";

  const semestre =
    student?.semestre || "No disponible";

  const promedio =
    student?.promedio_ponderado ?? "No disponible";

  const avance =
    student?.porcentaje_avance ?? 0;

  const materiasAprobadas =
    student?.materias_aprobadas ?? 0;

  // Cambiar de pantalla.
  const cambiarVista = (vista) => {
    setVistaActual(vista);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Regresar al inicio.
  const volverInicio = () => {
    cambiarVista("inicio");
  };

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

          {/* INICIO */}
          <button
            type="button"
            className={`nav-link ${
              vistaActual === "inicio" ? "active" : ""
            }`}
            onClick={volverInicio}
          >
            <LayoutDashboard size={19} />
            <span>Inicio</span>
          </button>

          {/* PERFIL */}
          <button
            type="button"
            className={`nav-link ${
              vistaActual === "perfil" ? "active" : ""
            }`}
            onClick={() => cambiarVista("perfil")}
          >
            <UserRound size={19} />
            <span>Mi perfil</span>
          </button>

          {/* CALIFICACIONES */}
          <button
            type="button"
            className={`nav-link ${
              vistaActual === "calificaciones" ? "active" : ""
            }`}
            onClick={() => cambiarVista("calificaciones")}
          >
            <BookOpen size={19} />
            <span>Calificaciones</span>
          </button>

          {/* KARDEX */}
          <button
            type="button"
            className={`nav-link ${
              vistaActual === "kardex" ? "active" : ""
            }`}
            onClick={() => cambiarVista("kardex")}
          >
            <ClipboardList size={19} />
            <span>Kardex</span>
          </button>

          {/* HORARIOS */}
          <button
            type="button"
            className={`nav-link ${
              vistaActual === "horarios" ? "active" : ""
            }`}
            onClick={() => cambiarVista("horarios")}
          >
            <CalendarDays size={19} />
            <span>Horarios</span>
          </button>

          {/* COMUNIDAD ESTUDIANTIL */}
          <button
            type="button"
            className={`nav-link ${
              vistaActual === "comunidad" ? "active" : ""
            }`}
            onClick={() => cambiarVista("comunidad")}
          >
            <Users size={19} />
            <span>Comunidad estudiantil</span>
          </button>

        </nav>

        {/* CERRAR SESIÓN */}
        <div className="sidebar-bottom">

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            <LogOut size={19} />
            <span>Cerrar sesión</span>
          </button>

        </div>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-main">

        {/* VISTA DE INICIO */}
        {vistaActual === "inicio" && (

          <>

            <header className="dashboard-header">

              <div>
                <p className="header-subtitle">
                  ESPACIO ESTUDIANTIL
                </p>

                <h1>Panel principal</h1>
              </div>

              <button
                className="notification-button"
                aria-label="Notificaciones"
              >
                <Bell size={20} />
              </button>

            </header>

            {/* BIENVENIDA */}
            <section className="welcome-card">

              <div>
                <span className="welcome-tag">
                  PORTAL ESTUDIANTIL
                </span>

                <h2>¡Hola, {nombre}!</h2>

                <p>
                  Bienvenido a tu espacio académico.
                  Aquí podrás consultar y organizar tu
                  información escolar.
                </p>
              </div>

              <div className="welcome-icon">
                <GraduationCap size={65} strokeWidth={1.3} />
              </div>

            </section>

            {/* INFORMACIÓN DEL ESTUDIANTE */}
            <section className="section-container">

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

                  <p>
                    Estudiante del Instituto Tecnológico de Celaya
                  </p>

                  <div className="profile-details">

                    <span>
                      <strong>Matrícula:</strong> {matricula}
                    </span>

                    <span>
                      <strong>Semestre:</strong> {semestre}
                    </span>

                    <span>
                      <strong>Correo:</strong> {correo}
                    </span>

                  </div>

                </div>

              </div>

            </section>

            {/* RESUMEN ACADÉMICO */}
            <section className="section-container">

              <div className="section-heading">
                <div>
                  <h2>Mi resumen académico</h2>
                  <p>Indicadores de tu trayectoria escolar</p>
                </div>
              </div>

              <div className="metrics-grid">

                {/* PROMEDIO */}
                <article className="metric-card">

                  <div className="metric-icon blue">
                    <BookOpen size={23} />
                  </div>

                  <div>
                    <p>Promedio ponderado</p>

                    <h3>
                      {Number.isFinite(Number(promedio))
                        ? Number(promedio).toFixed(2)
                        : promedio}
                    </h3>
                  </div>

                </article>

                {/* MATERIAS APROBADAS */}
                <article className="metric-card">

                  <div className="metric-icon green">
                    <GraduationCap size={23} />
                  </div>

                  <div>
                    <p>Materias aprobadas</p>
                    <h3>{materiasAprobadas}</h3>
                  </div>

                </article>

                {/* AVANCE */}
                <article className="metric-card">

                  <div className="metric-icon purple">
                    <ClipboardList size={23} />
                  </div>

                  <div>
                    <p>Avance académico</p>
                    <h3>{avance}%</h3>
                  </div>

                </article>

                {/* SEMESTRE */}
                <article className="metric-card">

                  <div className="metric-icon orange">
                    <CalendarDays size={23} />
                  </div>

                  <div>
                    <p>Semestre actual</p>
                    <h3>{semestre}</h3>
                  </div>

                </article>

              </div>

            </section>

            {/* ACCESOS ACADÉMICOS */}
            <section className="section-container">

              <div className="section-heading">
                <div>
                  <h2>Mi espacio académico</h2>
                  <p>
                    Accede rápidamente a tus servicios escolares
                  </p>
                </div>
              </div>

              <div className="academic-grid">

                <article
                  className="academic-card"
                  onClick={() => cambiarVista("calificaciones")}
                >

                  <div className="academic-icon blue">
                    <BookOpen size={25} />
                  </div>

                  <h3>Calificaciones</h3>

                  <p>
                    Consulta tus resultados académicos.
                  </p>

                  <span className="card-link">
                    Consultar <ChevronRight size={16} />
                  </span>

                </article>

                <article
                  className="academic-card"
                  onClick={() => cambiarVista("kardex")}
                >
                  <div className="academic-icon purple">
                    <ClipboardList size={25} />
                  </div>

                  <h3>Kardex</h3>

                  <p>
                    Revisa tu historial académico.
                  </p>

                  <span className="card-link">
                    Consultar <ChevronRight size={16} />
                  </span>
                </article>

                <article
  className="academic-card"
  onClick={() => cambiarVista("horarios")}
>
  <div className="academic-icon green">
    <CalendarDays size={25} />
  </div>

  <h3>Horarios</h3>

  <p>
    Consulta tus clases organizadas por día y hora.
  </p>

  <span className="card-link">
    Consultar <ChevronRight size={16} />
  </span>
</article>
              </div>

            </section>

          </>

        )}

        {/* VISTA DE PERFIL */}
        {vistaActual === "perfil" && (

          <>

            <button
              type="button"
              className="back-button"
              onClick={volverInicio}
            >
              <ArrowLeft size={17} />
              Volver al inicio
            </button>

            <header className="dashboard-header">
              <div>
                <p className="header-subtitle">
                  ESPACIO ESTUDIANTIL
                </p>

                <h1>Mi perfil</h1>
              </div>
            </header>

            <section className="section-container">

              <div className="section-heading">
                <div>
                  <h2>Información institucional</h2>
                  <p>Datos de tu cuenta de estudiante</p>
                </div>
              </div>

              <div className="profile-card">

                <div className="profile-avatar">
                  <UserRound size={30} />
                </div>

                <div className="profile-information">
                  <h3>{nombre}</h3>

                  <div className="profile-details">

                    <span>
                      <strong>Matrícula:</strong> {matricula}
                    </span>

                    <span>
                      <strong>Correo:</strong> {correo}
                    </span>

                    <span>
                      <strong>Semestre:</strong> {semestre}
                    </span>

                  </div>
                </div>

              </div>

            </section>

          </>

        )}

        {/* VISTA DE CALIFICACIONES */}
        {vistaActual === "calificaciones" && (

          <>

            <button
              type="button"
              className="back-button"
              onClick={volverInicio}
            >
              <ArrowLeft size={17} />
              Volver al inicio
            </button>

            <Calificaciones />

          </>

        )}

        {/* VISTA DE KARDEX */}
        {vistaActual === "kardex" && (
          <>
            <button
              type="button"
              className="back-button"
              onClick={volverInicio}
            >
              <ArrowLeft size={17} />
              Volver al inicio
            </button>

            <Kardex />
          </>
        )}

        {/* VISTA DE HORARIOS */}
        {vistaActual === "horarios" && (
          <>
            <button
              type="button"
              className="back-button"
              onClick={volverInicio}
            >
              <ArrowLeft size={17} />
              Volver al inicio
            </button>

            <Horarios />
          </>
        )}

        {/* VISTA DE COMUNIDAD */}
{vistaActual === "comunidad" && (
  <>
    <button
      type="button"
      className="back-button"
      onClick={volverInicio}
    >
      <ArrowLeft size={17} />
      Volver al inicio
    </button>

    <Comunidad csrfToken={csrfToken} />
  </>
)}

        <footer className="dashboard-footer">
          Tecnológico Nacional de México · Instituto Tecnológico de Celaya
        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
