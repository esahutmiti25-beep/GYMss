
// ==========================================
// LUNAS GYM - PANEL DE ADMINISTRACIÓN
// Versión de demostración (sin backend)
// ==========================================

// VALIDACIÓN DE SESIÓN

if (sessionStorage.getItem("adminSesion") !== "activa") {
    window.location.replace("admin-login.html");
} else {
    iniciarPanelAdmin();
}

function iniciarPanelAdmin() {

    // ==========================================
    // USUARIOS DE PRUEBA
    // ==========================================

    const usuariosDemo = [
        {
            id: 1,
            nombre: "Carlos Ramírez",
            correo: "carlos@ejemplo.com",
            fechaRegistro: "2026-09-10",
            plan: "Mensual",
            vencimiento: "2026-11-10",
            estado: "activa"
        },
        {
            id: 2,
            nombre: "Ana López",
            correo: "ana@ejemplo.com",
            fechaRegistro: "2026-09-15",
            plan: "Trimestral",
            vencimiento: "2026-12-15",
            estado: "activa"
        },
        {
            id: 3,
            nombre: "Luis Hernández",
            correo: "luis@ejemplo.com",
            fechaRegistro: "2026-08-20",
            plan: "Mensual",
            vencimiento: "2026-09-20",
            estado: "vencida"
        },
        {
            id: 4,
            nombre: "María González",
            correo: "maria@ejemplo.com",
            fechaRegistro: "2026-10-01",
            plan: "Sin plan",
            vencimiento: null,
            estado: "sin-membresia"
        },
        {
            id: 5,
            nombre: "Pedro Martínez",
            correo: "pedro@ejemplo.com",
            fechaRegistro: "2026-09-25",
            plan: "Trimestral",
            vencimiento: "2026-12-25",
            estado: "suspendida"
        }
    ];

    const usuariosAdmin = usuariosDemo.map(usuario => ({ ...usuario }));

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const botonesNavegacion =
        document.querySelectorAll(".admin-nav-item");

    const secciones = {
        dashboard: document.getElementById("seccionDashboard"),
        usuarios: document.getElementById("seccionUsuarios"),
        membresias: document.getElementById("seccionMembresias")
    };

    const tituloSeccion =
        document.getElementById("tituloSeccionAdmin");

    const totalUsuarios =
        document.getElementById("totalUsuariosAdmin");

    const membresiasActivas =
        document.getElementById("membresiasActivasAdmin");

    const tablaRecientes =
        document.getElementById("tablaUsuariosRecientes");

    const tablaUsuarios =
        document.getElementById("tablaUsuariosAdmin");

    const tablaMembresias =
        document.getElementById("tablaMembresiasAdmin");

    const buscarUsuario =
        document.getElementById("buscarUsuarioAdmin");

    const mensajeUsuarios =
        document.getElementById("mensajeUsuariosAdmin");

    const mensajeMembresias =
        document.getElementById("mensajeMembresiasAdmin");

    const botonCerrarSesion =
        document.getElementById("cerrarSesionAdmin");

    // ==========================================
    // FUNCIONES GENERALES
    // ==========================================

    function formatearFecha(fechaTexto) {
        if (!fechaTexto) return "—";

        const fecha = new Date(fechaTexto + "T12:00:00");

        if (Number.isNaN(fecha.getTime())) return "—";

        return fecha.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function nombreEstado(estado) {
        const nombres = {
            activa: "Activa",
            vencida: "Vencida",
            suspendida: "Suspendida",
            "sin-membresia": "Sin membresía"
        };

        return nombres[estado] || "Desconocido";
    }

    function crearCelda(texto) {
        const celda = document.createElement("td");
        celda.textContent = texto;
        return celda;
    }

    function crearEstado(estado) {
        const etiqueta = document.createElement("span");

        etiqueta.className = "admin-estado " + estado;
        etiqueta.textContent = nombreEstado(estado);

        return etiqueta;
    }

    // ==========================================
    // NAVEGACIÓN
    // ==========================================

    function mostrarSeccion(nombre) {
        if (!secciones[nombre]) return;

        Object.entries(secciones).forEach(([clave, seccion]) => {
            seccion.classList.toggle("oculto", clave !== nombre);
        });

        botonesNavegacion.forEach(boton => {
            const activo = boton.dataset.seccion === nombre;

            boton.classList.toggle("activo", activo);
            boton.setAttribute("aria-pressed", String(activo));
        });

        const titulos = {
            dashboard: "Dashboard",
            usuarios: "Usuarios",
            membresias: "Membresías"
        };

        tituloSeccion.textContent = titulos[nombre];
    }

    botonesNavegacion.forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarSeccion(boton.dataset.seccion);
        });
    });

    document.getElementById("verTodosUsuarios")
        .addEventListener("click", () => {
            mostrarSeccion("usuarios");
        });

    // ==========================================
    // DASHBOARD
    // ==========================================

    function cargarDashboard() {
        totalUsuarios.textContent = usuariosAdmin.length;

        const activas = usuariosAdmin.filter(usuario => {
            return usuario.estado === "activa";
        });

        membresiasActivas.textContent = activas.length;

        tablaRecientes.replaceChildren();

        const recientes = [...usuariosAdmin]
            .sort((a, b) =>
                b.fechaRegistro.localeCompare(a.fechaRegistro)
            )
            .slice(0, 5);

        recientes.forEach(usuario => {
            const fila = document.createElement("tr");

            fila.appendChild(crearCelda(usuario.nombre));
            fila.appendChild(crearCelda(usuario.correo));
            fila.appendChild(
                crearCelda(formatearFecha(usuario.fechaRegistro))
            );

            tablaRecientes.appendChild(fila);
        });
    }

    // ==========================================
    // USUARIOS
    // ==========================================

    function cargarUsuarios() {
        const busqueda = buscarUsuario.value.trim().toLowerCase();

        const filtrados = usuariosAdmin.filter(usuario => {
            return (
                usuario.nombre.toLowerCase().includes(busqueda) ||
                usuario.correo.toLowerCase().includes(busqueda)
            );
        });

        tablaUsuarios.replaceChildren();

        filtrados.forEach(usuario => {
            const fila = document.createElement("tr");

            fila.appendChild(crearCelda(usuario.nombre));
            fila.appendChild(crearCelda(usuario.correo));
            fila.appendChild(
                crearCelda(formatearFecha(usuario.fechaRegistro))
            );

            const celdaEstado = document.createElement("td");
            celdaEstado.appendChild(crearEstado(usuario.estado));

            fila.appendChild(celdaEstado);
            tablaUsuarios.appendChild(fila);
        });

        mensajeUsuarios.classList.toggle(
            "oculto",
            filtrados.length > 0
        );
    }

    buscarUsuario.addEventListener("input", cargarUsuarios);

    // ==========================================
    // MEMBRESÍAS
    // ==========================================

    function cargarMembresias() {
        tablaMembresias.replaceChildren();

        const miembros = usuariosAdmin.filter(usuario => {
            return usuario.plan !== "Sin plan";
        });

        miembros.forEach(usuario => {
            const fila = document.createElement("tr");

            fila.appendChild(crearCelda(usuario.nombre));
            fila.appendChild(crearCelda(usuario.plan));
            fila.appendChild(
                crearCelda(formatearFecha(usuario.vencimiento))
            );

            const celdaEstado = document.createElement("td");
            celdaEstado.appendChild(crearEstado(usuario.estado));
            fila.appendChild(celdaEstado);

            const celdaAccion = document.createElement("td");
            const selector = document.createElement("select");

            selector.className = "admin-select-estado";
            selector.setAttribute(
                "aria-label",
                "Cambiar estado de membresía de " + usuario.nombre
            );

            const estados = ["activa", "vencida", "suspendida"];

            estados.forEach(estado => {
                const opcion = document.createElement("option");

                opcion.value = estado;
                opcion.textContent = nombreEstado(estado);

                selector.appendChild(opcion);
            });

            selector.value = usuario.estado;

            selector.addEventListener("change", () => {
                usuario.estado = selector.value;

                cargarDashboard();
                cargarUsuarios();
                cargarMembresias();
            });

            celdaAccion.appendChild(selector);
            fila.appendChild(celdaAccion);

            tablaMembresias.appendChild(fila);
        });

        mensajeMembresias.classList.toggle(
            "oculto",
            miembros.length > 0
        );
    }

    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", () => {
            sessionStorage.removeItem("adminSesion");
            window.location.replace("admin-login.html");
        });
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    function iniciarAdmin() {
        cargarDashboard();
        cargarUsuarios();
        cargarMembresias();

        mostrarSeccion("dashboard");
    }

    iniciarAdmin();
}
