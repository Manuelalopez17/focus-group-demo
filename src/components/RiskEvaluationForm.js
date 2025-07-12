import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../firebase"; // Asegúrate de que este archivo tenga la config de "focus-group-riesgos"

const etapas = [
  "Diseño", "Fabricación", "Transporte", "Montaje", "Construcción",
  "Logística y Transporte", "Suministro", "Contratación y Adquisición",
  "Puesta en Marcha", "Disposición Final", "Planeación"
];

const riesgosPorEtapa = {
  "Diseño": [
    { id: "D01", descripcion: "Ambigüedad en especificaciones técnicas" },
    { id: "D02", descripcion: "Errores de diseño estructural" }
  ],
  "Fabricación": [
    { id: "F01", descripcion: "Defectos en control de calidad" },
    { id: "F02", descripcion: "Demoras en la producción" }
  ],
  "Transporte": [
    { id: "T01", descripcion: "Retrasos logísticos" },
    { id: "T02", descripcion: "Daños durante el transporte" }
  ],
  "Montaje": [
    { id: "M01", descripcion: "Fallas en ensamblaje en obra" }
  ],
  "Construcción": [
    { id: "C01", descripcion: "Condiciones climáticas adversas" }
  ],
  "Logística y Transporte": [
    { id: "LT01", descripcion: "Problemas de almacenamiento temporal" }
  ],
  "Suministro": [
    { id: "S01", descripcion: "Demora de proveedores" }
  ],
  "Contratación y Adquisición": [
    { id: "CA01", descripcion: "Retraso en procesos de contratación" }
  ],
  "Puesta en Marcha": [
    { id: "PM01", descripcion: "Fallas al iniciar operaciones" }
  ],
  "Disposición Final": [
    { id: "DF01", descripcion: "Problemas con residuos o desechos" }
  ],
  "Planeación": [
    { id: "PL01", descripcion: "Planificación inadecuada del cronograma" }
  ]
};

export default function RiskEvaluationForm() {
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const [evaluaciones, setEvaluaciones] = useState({});

  const handleChange = (riesgoId, campo, valor) => {
    setEvaluaciones(prev => ({
      ...prev,
      [riesgoId]: {
        ...prev[riesgoId],
        [campo]: parseInt(valor)
      }
    }));
  };

  const guardarEvaluaciones = () => {
    if (!etapaSeleccionada) {
      alert("Por favor selecciona una etapa.");
      return;
    }

    const riesgos = riesgosPorEtapa[etapaSeleccionada] || [];

    let datosCompletos = true;

    riesgos.forEach(riesgo => {
      const datos = evaluaciones[riesgo.id];
      if (!datos || !datos.impacto || !datos.frecuencia || datos.pesoImpacto == null) {
        datosCompletos = false;
      }
    });

    if (!datosCompletos) {
      alert("Por favor completa todos los campos para cada riesgo.");
      return;
    }

    riesgos.forEach(riesgo => {
      const datos = evaluaciones[riesgo.id];

      const pesoImpacto = datos.pesoImpacto / 100;
      const pesoFrecuencia = 1 - pesoImpacto;
      const scoreBase = datos.impacto * datos.frecuencia;
      const scoreFinal = (datos.impacto * pesoImpacto) + (datos.frecuencia * pesoFrecuencia);

      push(ref(database, `evaluaciones/${etapaSeleccionada}/${riesgo.id}`), {
        impacto: datos.impacto,
        frecuencia: datos.frecuencia,
        pesoImpacto,
        pesoFrecuencia,
        scoreBase,
        scoreFinal,
        timestamp: new Date().toISOString()
      });
    });

    alert("✅ Evaluaciones guardadas exitosamente.");
    setEvaluaciones({});
    setEtapaSeleccionada("");
  };

  return (
    <div>
      <h2>Evaluación de Riesgos</h2>

      <label>Selecciona la etapa del proyecto:</label>
      <select
        value={etapaSeleccionada}
        onChange={(e) => setEtapaSeleccionada(e.target.value)}
      >
        <option value="">-- Selecciona una etapa --</option>
        {etapas.map(etapa => (
          <option key={etapa} value={etapa}>{etapa}</option>
        ))}
      </select>

      {etapaSeleccionada && (
        <div style={{ marginTop: "20px" }}>
          {riesgosPorEtapa[etapaSeleccionada].map((riesgo) => {
            const datos = evaluaciones[riesgo.id] || {};
            const pesoImpacto = datos.pesoImpacto || 0;
            const pesoFrecuencia = 100 - pesoImpacto;
            const impacto = datos.impacto || 0;
            const frecuencia = datos.frecuencia || 0;
            const scoreBase = impacto * frecuencia;
            const scoreFinal = (impacto * (pesoImpacto / 100)) + (frecuencia * (pesoFrecuencia / 100));

            return (
              <div key={riesgo.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
                <strong>{riesgo.id}</strong>: {riesgo.descripcion}<br />

                Impacto:
                <select value={impacto} onChange={(e) => handleChange(riesgo.id, "impacto", e.target.value)}>
                  <option value="">--</option>
                  {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                Frecuencia:
                <select value={frecuencia} onChange={(e) => handleChange(riesgo.id, "frecuencia", e.target.value)}>
                  <option value="">--</option>
                  {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                Importancia del Impacto (%):
                <select value={pesoImpacto} onChange={(e) => handleChange(riesgo.id, "pesoImpacto", e.target.value)}>
                  <option value="">--</option>
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(p => (
                    <option key={p} value={p}>{p}%</option>
                  ))}
                </select>

                <p>Importancia de la Frecuencia: <strong>{pesoFrecuencia}%</strong></p>
                <p>🎯 <strong>Score Base (I×F):</strong> {scoreBase}</p>
                <p>⭐ <strong>Score Final con Importancia:</strong> {scoreFinal.toFixed(2)}</p>
              </div>
            );
          })}

          <button onClick={guardarEvaluaciones}>Guardar Evaluaciones</button>
        </div>
      )}
    </div>
  );
}
