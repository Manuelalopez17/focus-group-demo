// components/RiskEvaluationForm.js
import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../firebase";

const etapas = [
  "Diseño",
  "Fabricación",
  "Transporte",
  "Montaje",
  "Construcción",
  "Logística y Transporte",
  "Suministro",
  "Contratación y Adquisición",
  "Puesta en Marcha",
  "Disposición Final",
  "Planeación"
];

const riesgosPorEtapa = {
  Diseño: [
    { id: "D01", descripcion: "Ambigüedad en especificaciones técnicas" },
    { id: "D02", descripcion: "Errores de diseño estructural" },
    // Agrega los demás riesgos aquí...
  ],
  Fabricación: [
    { id: "F01", descripcion: "Defectos en control de calidad" },
    // ...
  ],
  // Agrega las demás etapas...
};

export default function RiskEvaluationForm() {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const [evaluaciones, setEvaluaciones] = useState({});

  const handleChange = (riesgoId, campo, valor) => {
    setEvaluaciones((prev) => ({
      ...prev,
      [riesgoId]: {
        ...prev[riesgoId],
        [campo]: parseInt(valor)
      }
    }));
  };

  const guardarEvaluaciones = async () => {
    const riesgos = riesgosPorEtapa[etapaSeleccionada] || [];
    riesgos.forEach((riesgo) => {
      const datos = evaluaciones[riesgo.id];
      if (datos) {
        const score = datos.impacto * datos.frecuencia * datos.importancia;
        push(ref(db, `evaluaciones/${etapaSeleccionada}/${riesgo.id}`), {
          ...datos,
          score,
          timestamp: new Date().toISOString()
        });
      }
    });
    alert("¡Evaluaciones guardadas!");
  };

  return (
    <div>
      <h2>Evaluación de Riesgos</h2>

      <label>Selecciona la etapa del proyecto:</label>
      <select onChange={(e) => setEtapaSeleccionada(e.target.value)}>
        <option value="">-- Selecciona una etapa --</option>
        {etapas.map((etapa) => (
          <option key={etapa} value={etapa}>
            {etapa}
          </option>
        ))}
      </select>

      {etapaSeleccionada && (
        <div style={{ marginTop: "20px" }}>
          {riesgosPorEtapa[etapaSeleccionada].map((riesgo) => (
            <div key={riesgo.id} style={{ marginBottom: "10px" }}>
              <strong>{riesgo.id}</strong>: {riesgo.descripcion}
              <br />
              Impacto:
              <select onChange={(e) => handleChange(riesgo.id, "impacto", e.target.value)}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              Frecuencia:
              <select onChange={(e) => handleChange(riesgo.id, "frecuencia", e.target.value)}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              Importancia:
              <select onChange={(e) => handleChange(riesgo.id, "importancia", e.target.value)}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          ))}

          <button onClick={guardarEvaluaciones}>Guardar Evaluaciones</button>
        </div>
      )}
    </div>
  );
}
