const formLogin = document.getElementById("formLogin");
const mensajeLogin = document.getElementById("mensajeLogin");
const recuperarContrasena = document.getElementById(
    "recuperarContrasena"
);

function mostrarMensajeLogin(texto) {
    mensajeLogin.textContent = texto;
    mensajeLogin.style.display = "block";
}

function obtenerUsuarioLogin() {
    try {
        return JSON.parse(localStorage.getItem("usuario"));
    } catch (error) {
        return null;
    }
}

formLogin.addEventListener("submit", function (event) {

    event.preventDefault();

    mensajeLogin.style.display = "none";

    const correo = document.getElementById("correo")
        .value.trim().toLowerCase();

    const contrasena = document.getElementById("contrasena").value;

    const usuario = obtenerUsuarioLogin();

    if (!usuario) {
        mostrarMensajeLogin(
            "No hay ninguna cuenta guardada. " +
            "Primero debes registrarte."
        );
        return;
    }

    if (!correo || !contrasena.trim()) {
        mostrarMensajeLogin(
            "Ingresa tu correo y contraseña."
        );
        return;
    }

    const correoGuardado = String(usuario.correo || "")
        .trim().toLowerCase();

    if (correoGuardado && correoGuardado !== correo) {
        mostrarMensajeLogin(
            "Este correo no coincide con la cuenta guardada. " +
            "Utiliza el correo con el que te registraste."
        );
        return;
    }

    if (!correoGuardado) {
        mostrarMensajeLogin(
            "Tu cuenta anterior no tiene un correo registrado. " +
            "Usa la opción de recuperación de acceso."
        );
        return;
    }

    // La contraseña NO se verifica:
    // el proyecto aún no tiene backend.

    sessionStorage.setItem("sesionLunasGym", "activa");

    window.location.href = "perfil.html";

});

recuperarContrasena.addEventListener("click", function (event) {

    event.preventDefault();

    const usuario = obtenerUsuarioLogin();

    if (!usuario) {
        mostrarMensajeLogin(
            "No hay una cuenta guardada en este navegador."
        );
        return;
    }

    // Recuperación solo para el prototipo local.
    // No equivale a restablecer una contraseña real.

    const confirmar = window.confirm(
        "Esta es una demostración sin autenticación real. " +
        "¿Quieres abrir el perfil local guardado en este navegador?"
    );

    if (!confirmar) {
        return;
    }

    sessionStorage.setItem("sesionLunasGym", "activa");

    window.location.href = "perfil.html";

});
