import { useEffect, useMemo, useState } from "react";
import {
    obtenerCalificaciones,
    obtenerKardex
} from "../services/calificacionesService";

import {
    BookOpen,
    Search,
    RefreshCw,
    GraduationCap
} from "lucide-react";

import "./Calificaciones.css";
import logoITC from "../../image/logo_itcelaya.png";

function Calificaciones() {
    const [periodos, setPeriodos] = useState([]);
    const [kardex, setKardex] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Cargar evaluaciones parciales y calificaciones finales
    const cargarCalificaciones = async () => {
        try {
            setLoading(true);
            setError("");

            const [datosCalificaciones, datosKardex] = await Promise.all([
                obtenerCalificaciones(),
                obtenerKardex()
            ]);

            setPeriodos(Array.isArray(datosCalificaciones) ? datosCalificaciones : []);
            setKardex(Array.isArray(datosKardex) ? datosKardex : []);

        } catch (err) {
            setError(err.message || "No fue posible cargar las calificaciones.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCalificaciones();
    }, []);

    // Convertir evaluaciones parciales en registros
    const materias = useMemo(() => {
        return periodos.flatMap((periodoData, indicePeriodo) => {
            const materiasPeriodo = periodoData.materias || [];

            return materiasPeriodo.map((registro, indiceMateria) => {
                const materia = registro.materia || {};

                const evaluaciones =
                    registro.calificaciones ||
                    registro.calificaiones ||
                    [];

                const evaluacionesOrdenadas = [...evaluaciones].sort(
                    (a, b) =>
                        Number(a.numero_calificacion) -
                        Number(b.numero_calificacion)
                );

                const evaluacionesRegistradas = evaluacionesOrdenadas.filter(
                    evaluacion =>
                        evaluacion.calificacion !== null &&
                        evaluacion.calificacion !== ""
                );

                const ultimaEvaluacion =
                    evaluacionesRegistradas.length > 0
                        ? evaluacionesRegistradas[evaluacionesRegistradas.length - 1]
                        : null;

                // Buscar la calificación final correspondiente en el Kardex
                const registroKardex = kardex.find(item =>
                    item.clave_materia === materia.clave_materia &&
                    item.periodo === periodoData.periodo?.clave_periodo
                );

                return {
                    id: `${indicePeriodo}-${indiceMateria}-${materia.id_grupo}`,
                    nombre: materia.nombre_materia || "Materia sin nombre",
                    clave: materia.clave_materia || "Sin clave",
                    grupo: materia.letra_grupo || "Sin grupo",
                    periodo: periodoData.periodo?.descripcion_periodo || "Periodo no disponible",
                    clavePeriodo: periodoData.periodo?.clave_periodo || "",
                    anio: periodoData.periodo?.anio || "",
                    evaluaciones: evaluacionesOrdenadas,
                    ultimaEvaluacion,
                    calificacionFinal: registroKardex?.calificacion ?? null,
                    descripcionFinal: registroKardex?.descripcion || ""
                };
            });
        });
    }, [periodos, kardex]);

    // Periodos disponibles
    const periodosDisponibles = useMemo(() => {
        return [...new Set(materias.map(materia => materia.periodo))];
    }, [materias]);

    // Búsqueda y filtrado
    const materiasFiltradas = useMemo(() => {
        return materias.filter(materia => {
            const texto = busqueda.toLowerCase();

            const coincideBusqueda =
                materia.nombre.toLowerCase().includes(texto) ||
                materia.clave.toLowerCase().includes(texto);

            const coincidePeriodo =
                periodoSeleccionado === "todos" ||
                materia.periodo === periodoSeleccionado;

            return coincideBusqueda && coincidePeriodo;
        });
    }, [materias, busqueda, periodoSeleccionado]);

    // Determinar color según calificación
    const obtenerDesempeno = (calificacion) => {
        if (
            calificacion === null ||
            calificacion === "" ||
            calificacion === undefined
        ) {
            return "pending";
        }

        // Las calificaciones especiales como AC no son numéricas
        const valor = Number(calificacion);

        if (!Number.isFinite(valor)) {
            return "special";
        }

        if (valor >= 70) return "good";
        if (valor >= 60) return "warning";

        return "bad";
    };

    if (loading) {
        return (
            <div className="grades-loading">
                <RefreshCw className="loading-spinner" size={30} />
                <p>Cargando calificaciones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="grades-error">
                <h2>No fue posible cargar las calificaciones</h2>
                <p>{error}</p>

                <button onClick={cargarCalificaciones}>
                    <RefreshCw size={17} />
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div className="grades-page">

            {/* ENCABEZADO */}
            <header className="grades-header">
                <div>
                    <span className="grades-subtitle">
                        ESPACIO ESTUDIANTIL
                    </span>

                    <h1>Mis calificaciones</h1>

                    <p>
                        Consulta tus evaluaciones y calificaciones finales.
                    </p>
                </div>

                <div className="grades-header-icon">
                    <img src={logoITC} alt="Logo del Tecnológico de Celaya" className="grades-header-icon-img" />
                </div>
            </header>

            {/* RESUMEN */}
            <section className="grades-summary">
                <div className="grades-summary-icon">
                    <BookOpen size={25} />
                </div>

                <div>
                    <span>Materias encontradas</span>
                    <h2>{materiasFiltradas.length}</h2>
                </div>
            </section>

            {/* BUSCADOR Y FILTRO */}
            <section className="grades-filters">
                <div className="grades-search">
                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Buscar materia o clave..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>

                <select
                    value={periodoSeleccionado}
                    onChange={e => setPeriodoSeleccionado(e.target.value)}
                >
                    <option value="todos">Todos los periodos</option>

                    {periodosDisponibles.map(periodo => (
                        <option key={periodo} value={periodo}>
                            {periodo}
                        </option>
                    ))}
                </select>
            </section>

            {/* TARJETAS DE MATERIAS */}
            <section className="grades-cards-section">
                <div className="grades-table-heading">
                    <h2>Historial de calificaciones</h2>
                    <p>
                        Evaluaciones parciales y calificación final registrada.
                    </p>
                </div>

                {materiasFiltradas.length === 0 ? (
                    <div className="grades-empty">
                        No se encontraron materias con esos criterios.
                    </div>
                ) : (
                    <div className="grades-cards">
                        {materiasFiltradas.map(materia => (
                            <article className="subject-card" key={materia.id}>

                                {/* Materia */}
                                <header className="subject-card-header">
                                    <h3>{materia.nombre}</h3>

                                    <span className="subject-code">
                                        {materia.clave} · Grupo {materia.grupo}
                                    </span>
                                </header>

                                {/* Periodo académico */}
                                <div className="subject-field">
                                    <span className="subject-label">
                                        Periodo académico
                                    </span>

                                    <div className="subject-value">
                                        {materia.periodo}
                                    </div>
                                </div>

                                {/* Evaluaciones */}
                                <div className="subject-field">
                                    <span className="subject-label">
                                        Evaluaciones
                                    </span>

                                    <div className="subject-value">
                                        <div className="evaluation-list">
                                            {materia.evaluaciones.map(
                                                evaluacion => (
                                                    <span
                                                        key={evaluacion.id_calificacion}
                                                        className={`grade-badge ${obtenerDesempeno(evaluacion.calificacion)}`}
                                                        title={`Evaluación ${evaluacion.numero_calificacion}`}
                                                    >
                                                        E{evaluacion.numero_calificacion}:{" "}
                                                        {evaluacion.calificacion ?? "Pendiente"}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Última evaluación y calificación final */}
                                <div className="subject-grades">
                                    <div className="subject-field">
                                        <span className="subject-label">
                                            Última evaluación
                                        </span>

                                        <div className="subject-value subject-grade">
                                            {materia.ultimaEvaluacion ? (
                                                <span
                                                    className={`grade-badge ${obtenerDesempeno(materia.ultimaEvaluacion.calificacion)}`}
                                                >
                                                    {materia.ultimaEvaluacion.calificacion}
                                                </span>
                                            ) : (
                                                <span className="grade-badge pending">
                                                    Sin registro
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="subject-field">
                                        <span className="subject-label">
                                            Calificación final
                                        </span>

                                        <div className="subject-value subject-grade">
                                            {materia.calificacionFinal !== null ? (
                                                <span
                                                    className={`grade-badge ${obtenerDesempeno(materia.calificacionFinal)}`}
                                                    title={materia.descripcionFinal}
                                                >
                                                    {materia.calificacionFinal}
                                                </span>
                                            ) : (
                                                <span className="grade-badge pending">
                                                    Sin registro
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Calificaciones;