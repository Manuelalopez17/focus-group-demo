import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración de Firebase (ya tienes estos datos)
const firebaseConfig = {
  apiKey: "AIzaSyD6UBfFDStFxtMI8WlnLnfylRcOE3r2iD0",
  authDomain: "focus-group-94efa.firebaseapp.com",
  databaseURL: "https://focus-group-94efa-default-rtdb.firebaseio.com",
  projectId: "focus-group-94efa",
  storageBucket: "focus-group-94efa.appspot.com",
  messagingSenderId: "253127150127",
  appId: "1:253127150127:web:1298b29b5969dd4ee054da"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la instancia de Realtime Database
export const database = getDatabase(app);
