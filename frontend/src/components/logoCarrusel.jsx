import { useState, useEffect } from "react";
import "./LogoCarrusel.css";

// Ajusta la ruta y los nombres a los de tu carpeta images
import logo1 from "../../image/logo_itcelaya.png";
import logo2 from "../../image/logo_lince.png";
import logo3 from "../../image/logo_tecnm.png";

const IMAGENES = [
  { src: logo1, alt: "Logo 1" },
  { src: logo2, alt: "Logo 2" },
  { src: logo3, alt: "Logo 3" }
];

const INTERVALO = 2000; // 2 segundos

function LogosCarrusel() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndice((actual) => (actual + 1) % IMAGENES.length);
    }, INTERVALO);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carrusel">
      {IMAGENES.map((img, i) => (
        <img
          key={img.alt}
          src={img.src}
          alt={img.alt}
          className={`carrusel-img ${i === indice ? "activa" : ""}`}
        />
      ))}
    </div>
  );
}

export default LogosCarrusel;