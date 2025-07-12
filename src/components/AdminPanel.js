import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

function AdminPanel() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const dbRef = ref(database);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const resultados = [];

      for (const etapa in data) {
        for (const riesgoId in data[etapa]) {
          const evaluaciones = Object.values(data[etapa][riesgoId]);
          const total = evaluaciones.length;

          const acumulado = evaluaciones.reduce(
            (acc, val) => {
              const scoreBase = val.impacto * val.frecuencia;
              acc.impacto += val.impacto;
              acc.frecuencia += val.frecuencia;
              acc.scoreBase += scoreBase;
              acc.scoreFinal += scoreBase * (val.importancia / 5);
              acc.timestamps.push(val.timestamp);
              return acc;
            },
            {
              impacto: 0,
              frecuencia: 0,
              scoreBase: 0,
              scoreFinal: 0,
              timestamps: [],
            }
          );

          resultados.push({
            etapa,
            riesgo: riesgoId,
            impacto: (acumulado.impacto / total).toFixed(2),
            frecuencia: (acumulado.frecuencia / total).toFixed(2),
            scoreBase: (acumulado.scoreBase / total).toFixed(2),
            scoreFinal: (acumulado.scoreFinal / total).toFixed(2),
            totalEvaluaciones: total,
            ultimoTimestamp: new Date(
              Math.max(...acumulado.timestamps)
            ).toLocaleString(),
          });
        }
      }

      // Ordenar por score base descendente
      resultados.sort((a, b) => b.scoreBase - a.scoreBase);
      setDatos(resultados);
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Panel del Administrador - Riesgos Priorizados</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Riesgo</th>
            <th>Prom. Impacto</th>
            <th>Prom. Frecuencia</th>
            <th>Score Base</th>
            <th>Score Final Ajustado</th>
            <th>N° Evaluaciones</th>
            <th>Última Actualización</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((r, i) => (
            <tr key={i}>
              <td>{r.etapa}</td>
              <td>{r.riesgo}</td>
              <td>{r.impacto}</td>
              <td>{r.frecuencia}</td>
              <td>{r.scoreBase}</td>
              <td>{r.scoreFinal}</td>
              <td>{r.totalEvaluaciones}</td>
              <td>{r.ultimoTimestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
