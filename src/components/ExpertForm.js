import React, { useState } from 'react';

export default function ExpertForm() {
  const riesgos = [
    "Retraso en la entrega de planos estructurales",
    "Incompatibilidad entre diseño arquitectónico y estructural",
    "Errores en los planos estructurales",
    "Modificaciones frecuentes en el diseño",
    "Falta de coordinación entre disciplinas",
  ];

  const [respuestas, setRespuestas] = useState({});

  const handleChange = (riesgo, campo, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [riesgo]: {
        ...prev[riesgo],
        [campo]: valor,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Respuestas enviadas:", respuestas);
    alert("¡Gracias por tu evaluación!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Evaluación de Riesgos - Etapa de Diseño</h1>
      {riesgos.map((riesgo, index) => (
        <div key={index} style={{ marginBottom: '1.5rem' }}>
          <strong>{riesgo}</strong>
          <div>
            Impacto:
            <select onChange={(e) => handleChange(riesgo, "Impacto", e.target.value)}>
              <option value="">--</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            Frecuencia:
            <select onChange={(e) => handleChange(riesgo, "Frecuencia", e.target.value)}>
              <option value="">--</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            Importancia:
            <select onChange={(e) => handleChange(riesgo, "Importancia", e.target.value)}>
              <option value="">--</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <button type="submit">Enviar evaluación</button>
    </form>
  );
}
