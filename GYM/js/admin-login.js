
document.addEventListener("DOMContentLoaded", () => {

    // Si ya existe una sesión, ir al dashboard
    if (sessionStorage.getItem("adminSesion") === "activa") {
        window.location.replace("admin.html");
        return;
    }

    const formulario = document.getElementById("formAdminLogin");
    const correo = document.getElementById("correoAdmin");
    const password = document.getElementById("passwordAdmin");
    const mensaje = document.getElementById("mensajeAdminLogin");

    // Credenciales de demostración
    const adminDemo = {
        correo: "admin@lunasgym.com",
        password: "Admin123"
    };

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const correoIngresado = correo.value.trim().toLowerCase();
        const passwordIngresada = password.value;

        mensaje.textContent = "";

        if (!correoIngresado || !passwordIngresada.trim()) {
            mensaje.textContent = "Completa todos los campos.";
            return;
        }

        if (
            correoIngresado !== adminDemo.correo ||
            passwordIngresada !== adminDemo.password
        ) {
            mensaje.textContent = "Correo o contraseña incorrectos.";
            password.value = "";
            return;
        }

        // Crear sesión temporal
        sessionStorage.setItem("adminSesion", "activa");

        // Abrir panel
        window.location.replace("admin.html");
    });
});
