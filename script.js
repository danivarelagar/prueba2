// Importar las funciones necesarias del SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const formCiudad = document.getElementById('form-ciudad');
const listaCiudades = document.getElementById('lista-ciudades');

formCiudad.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombreCiudad = document.getElementById('nombre-ciudad').value;
    const mejorMes = document.getElementById('mejor-mes').value;

    try {
        const docRef = await addDoc(collection(db, "ciudades"), {
            nombre: nombreCiudad,
            mejorMes: mejorMes,
            visitado: false
        });
        console.log("Documento escrito con ID: ", docRef.id);
        cargarCiudades();
    } catch (e) {
        console.error("Error añadiendo documento: ", e);
    }

    formCiudad.reset();
});

async function cargarCiudades() {
    listaCiudades.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, "ciudades"));
        querySnapshot.forEach((doc) => {
            const ciudad = doc.data();
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `
                ${ciudad.nombre} - Mejor mes: ${ciudad.mejorMes}
                <div>
                    <button class="btn btn-sm btn-success" onclick="marcarComoVisitado('${doc.id}', ${ciudad.visitado})">${ciudad.visitado ? 'Visitado' : 'Marcar como visitado'}</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCiudad('${doc.id}')">Eliminar</button>
                </div>
            `;
            listaCiudades.appendChild(li);
        });
    } catch (e) {
        console.error("Error cargando ciudades: ", e);
    }
}

window.eliminarCiudad = async (id) => {
    try {
        await deleteDoc(doc(db, "ciudades", id));
        cargarCiudades();
    } catch (e) {
        console.error("Error eliminando ciudad: ", e);
    }
};

window.marcarComoVisitado = async (id, visitado) => {
    try {
        await updateDoc(doc(db, "ciudades", id), {
            visitado: !visitado
        });
        cargarCiudades();
    } catch (e) {
        console.error("Error actualizando ciudad: ", e);
    }
};

cargarCiudades();
