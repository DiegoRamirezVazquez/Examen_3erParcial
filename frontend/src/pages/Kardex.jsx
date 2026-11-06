
import { useEffect, useMemo, useState } from "react";
import { obtenerKardex } from "../services/calificacionesService";
import {
    ClipboardList,
    Search,
    RefreshCw,
    GraduationCap
} from "lucide-react";

import "./Kardex.css";

function Kardex() {
    const [materias, setMaterias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [semestreSeleccionado, setSemestreSeleccionado] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [avance, setAvance] = useState(0);

    // Consultar historial académico
    const cargarKardex = async () => {
        try {
            setLoading(true);
            setError("");

            const datos = await obtenerKardex();

            setMaterias(Array.isArray(datos) ? datos : []);
        } catch (err) {
            setError(err.message || "No fue posible cargar el Kardex.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarKardex();
    }, []);

    // Semestres disponibles
    const semestres = useMemo(() => {
        return [...new Set(materias.map(m => m.semestre))]
            .sort((a, b) => Number(a) - Number(b));
    }, [materias]);

    // Filtrar materias
    const materiasFiltradas = useMemo(() => {
        return materias.filter(materia => {
            const texto = busqueda.toLowerCase();

            const coincideBusqueda =
                (materia.nombre_materia || "").toLowerCase().includes(texto) ||
                (materia.clave_materia || "").toLowerCase().includes(texto);

            const coincideSemestre =
                semestreSeleccionado === "todos" ||
                String(materia.semestre) === semestreSeleccionado;

            return coincideBusqueda && coincideSemestre;
        });
    }, [materias, busqueda, semestreSeleccionado]);

    // Clasificar calificaciones
    const obtenerDesempeno = (calificacion) => {
        const valor = Number(calificacion);

        if (calificacion === null || calificacion === "") {
            return "pending";
        }

        if (!Number.isFinite(valor)) {
            return "special";
        }

        if (valor >= 70) return "good";
        if (valor >= 60) return "warning";

        return "bad";
    };

    if (loading) {
        return (
            <div className="kardex-loading">
                <RefreshCw className="loading-spinner" size={30} />
                <p>Cargando historial académico...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="kardex-error">
                <h2>No fue posible cargar el Kardex</h2>
                <p>{error}</p>
                <button onClick={cargarKardex}>
                    <RefreshCw size={17} />
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div className="kardex-page">

            <header className="kardex-header">
                <div>
                    <span className="kardex-subtitle">
                        ESPACIO ESTUDIANTIL
                    </span>
                    <h1>Mi Kardex académico</h1>
                    <p>Consulta tu trayectoria académica completa.</p>
                </div>

                <div className="kardex-header-icon">
                    <GraduationCap size={35} />
                </div>
            </header>

            <section className="kardex-summary">
                <div className="kardex-summary-icon">
                    <ClipboardList size={25} />
                </div>
                <div>
                    <span>Materias registradas</span>
                    <h2>{materias.length}</h2>
                </div>
            </section>

            <section className="kardex-filters">
                <div className="kardex-search">
                    <Search size={19} />
                    <input
                        type="text"
                        placeholder="Buscar materia o clave..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>

                <select
                    value={semestreSeleccionado}
                    onChange={e => setSemestreSeleccionado(e.target.value)}
                >
                    <option value="todos">Todos los semestres</option>
                    {semestres.map(semestre => (
                        <option key={semestre} value={String(semestre)}>
                            Semestre {semestre}
                        </option>
                    ))}
                </select>
            </section>

            <section className="kardex-table-container">
                <div className="kardex-table-heading">
                    <div>
                        <h2>Historial de materias</h2>
                        <p>Calificaciones finales registradas en el SII.</p>
                    </div>
                </div>

                {materiasFiltradas.length === 0 ? (
                    <div className="kardex-empty">
                        No se encontraron materias.
                    </div>
                ) : (
                    <div className="kardex-table-scroll">
                        <table className="kardex-table">
                            <thead>
                                <tr>
                                    <th>Materia</th>
                                    <th>Semestre</th>
                                    <th>Periodo</th>
                                    <th>Créditos</th>
                                    <th>Calificación final</th>
                                    <th>Tipo de acreditación</th>
                                </tr>
                            </thead>

                            <tbody>
                                {materiasFiltradas.map((materia, index) => (
                                    <tr key={`${materia.clave_materia}-${materia.periodo}-${index}`}>
                                        <td>
                                            <strong>{materia.nombre_materia}</strong>
                                            <span className="kardex-subject-code">
                                                {materia.clave_materia}
                                            </span>
                                        </td>

                                        <td>{materia.semestre}</td>
                                        <td>{materia.periodo}</td>
                                        <td>{materia.creditos}</td>

                                        <td>
                                            <span className={`kardex-grade ${obtenerDesempeno(materia.calificacion)}`}>
                                                {materia.calificacion ?? "Sin registro"}
                                            </span>
                                        </td>

                                        <td>{materia.descripcion || "No disponible"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="kardex-legend">
                <span><i className="legend-dot good"></i> Aprobatoria (70-100)</span>
                <span><i className="legend-dot warning"></i> En observación (60-69)</span>
                <span><i className="legend-dot bad"></i> No aprobatoria (0-59)</span>
                <span>AC: Acreditación especial</span>
            </section>

        </div>
    );
}

export default Kardex;
