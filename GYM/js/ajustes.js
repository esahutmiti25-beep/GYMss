// Elementos

const formularioPerfil =
    document.getElementById("formularioPerfil");

const nombreUsuario =
    document.getElementById("nombreUsuario");

const correoUsuario =
    document.getElementById("correoUsuario");

const telefonoUsuario =
    document.getElementById("telefonoUsuario");

const formularioContrasena =
    document.getElementById("formularioContrasena");

const recordatorios =
    document.getElementById("recordatorios");

const mostrarEstadisticas =
    document.getElementById("mostrarEstadisticas");

const botonCerrarSesion =
    document.getElementById("botonCerrarSesion");

const eliminarCuenta =
    document.getElementById("eliminarCuenta");


// Obtener información guardada

let usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    );


// Datos temporales mientras no existe backend

if (!usuario) {

    usuario = {

        nombre: "Esahu",

        correo: "esahu@lunasgym.com",

        telefono: ""

    };


    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );

}


// Mostrar datos

function cargarUsuario() {

    nombreUsuario.value =
        usuario.nombre || "";

    correoUsuario.value =
        usuario.correo || "";

    telefonoUsuario.value =
        usuario.telefono || "";

}


// Guardar información personal

formularioPerfil.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        usuario = {

            nombre:
                nombreUsuario.value.trim(),

            correo:
                correoUsuario.value.trim(),

            telefono:
                telefonoUsuario.value.trim()

        };


        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );


        alert(
            "Información actualizada correctamente."
        );

    }
);


// Cambio de contraseña

formularioContrasena.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const actual =
            document.getElementById(
                "contrasenaActual"
            ).value;

        const nueva =
            document.getElementById(
                "nuevaContrasena"
            ).value;

        const confirmar =
            document.getElementById(
                "confirmarContrasena"
            ).value;


        if (
            actual === "" ||
            nueva === "" ||
            confirmar === ""
        ) {

            alert(
                "Completa todos los campos."
            );

            return;

        }


        if (nueva.length < 6) {

            alert(
                "La nueva contraseña debe tener al menos 6 caracteres."
            );

            return;

        }


        if (nueva !== confirmar) {

            alert(
                "Las nuevas contraseñas no coinciden."
            );

            return;

        }


        /*
        Todavía no existe autenticación real.

        Cuando tengamos backend,
        aquí se comprobará la contraseña
        actual y se actualizará de forma segura.
        */


        alert(
            "Contraseña actualizada en modo demostración."
        );


        formularioContrasena.reset();

    }
);


// Preferencias

function cargarPreferencias() {

    const preferencias =
        JSON.parse(
            localStorage.getItem(
                "preferencias"
            )
        );


    if (!preferencias) {

        return;

    }


    recordatorios.checked =
        preferencias.recordatorios;


    mostrarEstadisticas.checked =
        preferencias.mostrarEstadisticas;

}


// Guardar preferencias

function guardarPreferencias() {

    const preferencias = {

        recordatorios:
            recordatorios.checked,

        mostrarEstadisticas:
            mostrarEstadisticas.checked

    };


    localStorage.setItem(
        "preferencias",
        JSON.stringify(preferencias)
    );

}


recordatorios.addEventListener(
    "change",
    guardarPreferencias
);


mostrarEstadisticas.addEventListener(
    "change",
    guardarPreferencias
);


// Cerrar sesión

botonCerrarSesion.addEventListener(
    "click",
    function () {

        const confirmar =
            confirm(
                "¿Quieres cerrar sesión?"
            );


        if (!confirmar) {

            return;

        }


        /*
        Por ahora no eliminamos los datos.

        Solamente regresamos al inicio,
        porque todavía no existe una
        sesión real.
        */


        window.location.href =
            "index.html";

    }
);


// Eliminar cuenta

eliminarCuenta.addEventListener(
    "click",
    function () {

        const confirmar =
            confirm(
                "¿Seguro que quieres eliminar tu cuenta y todos los datos guardados?"
            );


        if (!confirmar) {

            return;

        }


        const confirmarOtraVez =
            confirm(
                "Esta acción eliminará rutinas, entrenamientos, progreso y membresía. ¿Continuar?"
            );


        if (!confirmarOtraVez) {

            return;

        }


        localStorage.removeItem(
            "usuario"
        );

        localStorage.removeItem(
            "rutinas"
        );

        localStorage.removeItem(
            "historialEntrenamientos"
        );

        localStorage.removeItem(
            "membresia"
        );

        localStorage.removeItem(
            "preferencias"
        );


        alert(
            "Los datos locales de la cuenta fueron eliminados."
        );


        window.location.href =
            "index.html";

    }
);


// Iniciar página

cargarUsuario();

cargarPreferencias();