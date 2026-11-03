
// =======================================
// LUNAS GYM - REGISTRO DEMOSTRATIVO
// =======================================

const formRegistro = document.getElementById("formRegistro");
const mensajeRegistro = document.getElementById("mensajeRegistro");

function mostrarMensajeRegistro(texto) {
    mensajeRegistro.textContent = texto;
    mensajeRegistro.style.display = "block";
}

function obtenerUsuarioGuardado() {
    try {
        return JSON.parse(localStorage.getItem("usuario"));
    } catch (error) {
        return null;
    }
}

formRegistro.addEventListener("submit", function (event) {

    event.preventDefault();

    mensajeRegistro.style.display = "none";

    const nombre = document.getElementById("nombre").value.trim();

    const correo = document.getElementById("correo")
        .value.trim().toLowerCase();

    const telefono = document.getElementById("telefono").value.trim();

    const contrasena = document.getElementById("contrasena").value;

    const confirmar = document.getElementById("confirmar").value;

    const terminos = document.getElementById("terminos").checked;

    // Validaciones

    if (!nombre || !correo || !telefono) {
        mostrarMensajeRegistro("Completa todos los campos.");
        return;
    }

    if (contrasena.length < 8) {
        mostrarMensajeRegistro(
            "La contraseña debe tener al menos 8 caracteres."
        );
        return;
    }

    if (contrasena !== confirmar) {
        mostrarMensajeRegistro("Las contraseñas no coinciden.");
        return;
    }

    if (!terminos) {
        mostrarMensajeRegistro(
            "Debes aceptar los términos y condiciones."
        );
        return;
    }

    // Evitar sobrescribir una cuenta existente

    const usuarioExistente = obtenerUsuarioGuardado();

    if (usuarioExistente) {
        mostrarMensajeRegistro(
            "Ya existe una cuenta guardada en este navegador. " +
            "Inicia sesión con esa cuenta. " +
            "Tus rutinas y entrenamientos están protegidos."
        );
        return;
    }

    // Crear usuario sin almacenar contraseña

    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        fechaRegistro: new Date().toISOString()
    };

    localStorage.setItem(
        "usuario",
        JSON.stringify(nuevoUsuario)
    );

    // Sesión simulada

    sessionStorage.setItem("sesionLunasGym", "activa");

    window.location.href = "perfil.html";

});
