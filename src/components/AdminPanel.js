// pages/admin/[stage].js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { database } from '@/firebase';
import { onValue, ref } from 'firebase/database';

export default function AdminPanel() {
  const router = useRouter();
  const { stage } = router.query;
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    if (!stage) return;

    const stageRef = ref(database, `respuestas/${stage}`);

    const unsubscribe = onValue(stageRef, (snapshot) => {
      const values = snapshot.val();
      if (!values) {
        setData([]);
        setSummary({});
        return;
      }

      const consolidated = {};

      Object.values(values).forEach((userResponse) => {
        Object.entries(userResponse).forEach(([riskId, r]) => {
          if (!consolidated[riskId]) {
            consolidated[riskId] = {
              etapa: stage,
              riesgo: riskId,
              totalImpacto: 0,
              totalFrecuencia: 0,
              totalImportancia: 0,
              count: 0,
              timestamp: '',
            };
          }

          consolidated[riskId].totalImpacto += r.impacto;
          consolidated[riskId].totalFrecuencia += r.frecuencia;
          consolidated[riskId].totalImportancia += r.importancia;
          consolidated[riskId].count++;
          consolidated[riskId].timestamp = r.timestamp;
        });
      });

      const rows = Object.values(consolidated).map((item) => {
        const promImpacto = item.totalImpacto / item.count;
        const promFrecuencia = item.totalFrecuencia / item.count;
        const promImportancia = item.totalImportancia / item.count;
        const scoreBase = promImpacto * promFrecuencia;
        const scoreFinal = scoreBase * (promImportancia / 5);

        return {
          etapa: item.etapa,
          riesgo: item.riesgo,
          promImpacto: promImpacto.toFixed(2),
          promFrecuencia: promFrecuencia.toFixed(2),
          scoreBase: scoreBase.toFixed(2),
          scoreFinal: scoreFinal.toFixed(2),
          count: item.count,
          timestamp: item.timestamp,
        };
      });

      rows.sort((a, b) => b.scoreBase - a.scoreBase);

      setData(rows);
      setSummary({ total: rows.length });
    });

    return () => unsubscribe();
  }, [stage]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Panel del Administrador - Riesgos Priorizados</h2>

      {summary.total > 0 ? (
        <>
          <table border="1" cellPadding="5" style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Etapa</th>
                <th>Riesgo</th>
                <th>Prom. Impacto</th>
                <th>Prom. Frecuencia</th>
                <th>Score Base</th>
                <th>Score Final Ajustado</th>
                <th>Nº Evaluaciones</th>
                <th>Última Actualización</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.etapa}</td>
                  <td>{item.riesgo}</td>
                  <td>{item.promImpacto}</td>
                  <td>{item.promFrecuencia}</td>
                  <td>{item.scoreBase}</td>
                  <td>{item.scoreFinal}</td>
                  <td>{item.count}</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No hay datos disponibles para esta etapa.</p>
      )}
    </div>
  );
}
