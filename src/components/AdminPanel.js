// components/AdminPanel.js
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

function AdminPanel() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const dbRef = ref(database); // ✅ leer desde la raíz de la base de datos

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const evaluaciones = [];

      if (data) {
        Object.entries(data).forEach(([etapa, riesgos]) => {
          Object.entries(riesgos).forEach(([riesgoId, registros]) => {
            Object.entries(registros).forEach(([registroId, valores]) => {
              evaluaciones.push({
                etapa,
                riesgoId,
                impacto: valores.impacto || 0,
                frecuencia: valores.frecuencia || 0,
                pesoImpacto: (valores.pesoImpacto || 0) * 100,
                pesoFrecuencia: (valores.pesoFrecuencia || 0) * 100,
                scoreBase: valores.scoreBase || 0,
                scoreFinal: valores.scoreFinal || 0,
                timestamp: valores.timestamp || "",
              });
            });
          });
        });
      }

      setDatos(evaluaciones);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>📊 Panel del Administrador</h2>
      <table border="1" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Riesgo</th>
            <th>Impacto</th>
            <th>Frecuencia</th>
            <th>% Importancia Impacto</th>
            <th>% Importancia Frecuencia</th>
            <th>Score Base</th>
            <th>Score Final Ajustado</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((r, i) => (
            <tr key={i}>
              <td>{r.etapa}</td>
              <td>{r.riesgoId}</td>
              <td>{r.impacto}</td>
              <td>{r.frecuencia}</td>
              <td>{r.pesoImpacto}%</td>
              <td>{r.pesoFrecuencia}%</td>
              <td>{r.scoreBase.toFixed(2)}</td>
              <td>{r.scoreFinal.toFixed(2)}</td>
              <td>{new Date(r.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
