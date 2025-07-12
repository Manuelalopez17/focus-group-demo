// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#fff",
      textAlign: "center",
      padding: "30px"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>🎯 Focus Group</h1>
      <p style={{ marginBottom: "40px", maxWidth: "500px" }}>
        Sistema de evaluación de riesgos en tiempo real<br />
        Matriz 5x5 colaborativa con sincronización instantánea
      </p>

      <Link to="/admin/DEMO123" style={{
        textDecoration: "none",
        margin: "10px"
      }}>
        <button style={{
          padding: "15px 30px",
          fontSize: "1.2rem",
          background: "#845ec2",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}>Panel Administrador</button>
      </Link>

      <Link to="/session/DEMO123" style={{
        textDecoration: "none",
        margin: "10px"
      }}>
        <button style={{
          padding: "15px 30px",
          fontSize: "1.2rem",
          background: "#00b4d8",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}>Participar en Sesión</button>
      </Link>
    </div>
  );
}

export default Home;
