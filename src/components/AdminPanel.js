import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import database from "../firebase";

function AdminPanel() {
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, 'respuestas');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setRespuestas(formatted);
      } else {
        setRespuestas([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>📊 Panel del Administrador</h2>
      <table border="1" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Riesgo</th>
            <th>Impacto</th>
            <th>Frecuencia</th>
            <th>Importancia</th>
            <th>Puntaje Total</th>
          </tr>
        </thead>
        <tbody>
          {respuestas.map((r) => (
            <tr key={r.id}>
              <td>{r.riesgo}</td>
              <td>{r.impacto}</td>
              <td>{r.frecuencia}</td>
              <td>{r.importancia}</td>
              <td>{r.impacto * r.frecuencia * r.importancia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
