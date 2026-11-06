
import { useEffect, useMemo, useState } from "react";
import { obtenerHorarios } from "../services/calificacionesService";
import {
    CalendarDays,
    Clock,
    MapPin,
    RefreshCw,
    GraduationCap
} from "lucide-react";

import "./Horarios.css";

const DIAS = [
    { clave: "lunes", nombre: "Lunes" },
    { clave: "martes", nombre: "Martes" },
    { clave: "miercoles", nombre: "Miércoles" },
    { clave: "jueves", nombre: "Jueves" },
    { clave: "viernes", nombre: "Viernes" },
    { clave: "sabado", nombre: "Sábado" }
];

function Horarios() {
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Consultar horarios del SII
    const cargarHorarios = async () => {
        try {
            setLoading(true);
            setError("");

            const datos = await obtenerHorarios();

            setPeriodos(Array.isArray(datos) ? datos : []);

        } catch (err) {
            setError(err.message || "No fue posible cargar los horarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarHorarios();
    }, []);

    // Obtener información del periodo actual
    const periodoActual = periodos[0]?.periodo;

    // Organizar las materias por día y hora
    const agenda = useMemo(() => {
        const resultado = {};

        DIAS.forEach(dia => {
            resultado[dia.clave] = [];
        });

        periodos.forEach(periodoData => {
            (periodoData.horario || []).forEach(materia => {
                DIAS.forEach(dia => {
                    const horario = materia[dia.clave];

                    if (!horario) return;

                    const [inicio, fin] = horario.split("-");

                    resultado[dia.clave].push({
                        id: `${materia.id_grupo}-${dia.clave}`,
                        nombre: materia.nombre_materia,
                        clave: materia.clave_materia,
                        grupo: materia.letra_grupo,
                        horario,
                        inicio,
                        fin,
                        salon: materia[`${dia.clave}_clave_salon`] || "No asignado"
                    });
                });
            });
        });

        // Ordenar las clases por hora de inicio
        Object.keys(resultado).forEach(dia => {
            resultado[dia].sort((a, b) =>
                a.inicio.localeCompare(b.inicio)
            );
        });

        return resultado;
    }, [periodos]);

    // Contar clases registradas
    const totalClases = Object.values(agenda)
        .reduce((total, clases) => total + clases.length, 0);

    if (loading) {
        return (
            <div className="schedule-loading">
                <RefreshCw className="loading-spinner" size={30} />
                <p>Cargando horario académico...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="schedule-error">
                <h2>No fue posible cargar el horario</h2>
                <p>{error}</p>

                <button onClick={cargarHorarios}>
                    <RefreshCw size={17} />
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div className="schedule-page">

            {/* ENCABEZADO */}
            <header className="schedule-header">
                <div>
                    <span className="schedule-subtitle">
                        ESPACIO ESTUDIANTIL
                    </span>

                    <h1>Mi horario académico</h1>

                    <p>
                        Organiza y consulta tus clases durante la semana.
                    </p>
                </div>

                <div className="schedule-header-icon">
                    <CalendarDays size={35} />
                </div>
            </header>

            {/* RESUMEN */}
            <section className="schedule-summary">
                <div className="schedule-summary-icon">
                    <GraduationCap size={25} />
                </div>

                <div>
                    <span>Clases programadas por semana</span>
                    <h2>{totalClases}</h2>
                </div>

                <div className="schedule-period">
                    <span>Periodo académico</span>
                    <strong>
                        {periodoActual?.descripcion_periodo || "No disponible"}
                    </strong>
                </div>
            </section>

            {/* AGENDA SEMANAL */}
            <section className="schedule-container">

                <div className="schedule-section-heading">
                    <div>
                        <h2>Agenda semanal</h2>
                        <p>Materias organizadas por día y hora.</p>
                    </div>
                </div>

                <div className="schedule-grid">

                    {DIAS.map(dia => (
                        <article
                            className="schedule-day"
                            key={dia.clave}
                        >
                            <header className="schedule-day-header">
                                {dia.nombre}
                            </header>

                            <div className="schedule-day-content">

                                {agenda[dia.clave].length === 0 ? (
                                    <div className="schedule-empty">
                                        Sin clases
                                    </div>
                                ) : (
                                    agenda[dia.clave].map(clase => (
                                        <div
                                            className="schedule-class"
                                            key={clase.id}
                                        >
                                            <strong className="schedule-class-name">
                                                {clase.nombre}
                                            </strong>

                                            <span className="schedule-class-code">
                                                {clase.clave} · Grupo {clase.grupo}
                                            </span>

                                            <div className="schedule-class-detail">
                                                <Clock size={14} />
                                                <span>{clase.horario}</span>
                                            </div>

                                            <div className="schedule-class-detail">
                                                <MapPin size={14} />
                                                <span>{clase.salon}</span>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>
                        </article>
                    ))}

                </div>
            </section>

            <p className="schedule-note">
                Horarios obtenidos del Sistema Integral de Información (SII).
            </p>

        </div>
    );
}

export default Horarios;
