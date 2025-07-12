// Importa solo lo necesario desde el SDK de Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración del nuevo proyecto en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAfAryg3eYLqj5Md0odrpckLrhPcVm510w",
  authDomain: "focus-group-riesgos-5353a.firebaseapp.com",
  projectId: "focus-group-riesgos-5353a",
  storageBucket: "focus-group-riesgos-5353a.appspot.com",
  messagingSenderId: "932406132125",
  appId: "1:932406132125:web:a9b2f9322a4ee8fe620374",
  measurementId: "G-PSY2R8BDTN",
  databaseURL: "https://focus-group-riesgos-5353a-default-rtdb.firebaseio.com",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la base de datos para usarla en otros componentes
export const database = getDatabase(app);
