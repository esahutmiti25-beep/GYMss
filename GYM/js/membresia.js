

// ========================================
// LUNAS GYM - MEMBRESÍAS
// ========================================

// PLANES DISPONIBLES

const planes = {
    visita: {
        nombre: "Acceso por día",
        precio: 50,
        periodo: "/ día",
        descripcion: "Acceso completo al gimnasio durante un día.",
        dias: 1
    },

    mensual: {
        nombre: "Plan mensual",
        precio: 400,
        periodo: "/ mes",
        descripcion: "Acceso completo al gimnasio durante todo el mes.",
        dias: 30
    },

    trimestral: {
        nombre: "Plan trimestral",
        precio: 1000,
        periodo: "/ 3 meses",
        descripcion: "Acceso completo al gimnasio durante tres meses.",
        dias: 90
    }
};

// ========================================
// ELEMENTOS
// ========================================

const nombrePlanActual = document.getElementById("nombrePlanActual");
const precioPlanActual = document.getElementById("precioPlanActual");
const periodoPlanActual = document.getElementById("periodoPlanActual");
const descripcionPlanActual = document.getElementById("descripcionPlanActual");
const fechaInicio = document.getElementById("fechaInicio");
const fechaRenovacion = document.getElementById("fechaRenovacion");
const estadoPlanActual = document.getElementById("estadoPlanActual");
const estadoMembresiaDato = document.getElementById("estadoMembresiaDato");
const diasRestantes = document.getElementById("diasRestantes");
const botonRenovar = document.getElementById("botonRenovar");
const mensajeMembresia = document.getElementById("mensajeMembresia");
const historialMembresias = document.getElementById("historialMembresias");

// ========================================
// ALMACENAMIENTO
// ========================================

function leerLocal(clave, respaldo) {
    try {
        const valor = JSON.parse(localStorage.getItem(clave));
        return valor ?? respaldo;
    } catch (error) {
        console.warn("No se pudo leer:", clave);
        return respaldo;
    }
}

let membresia = leerLocal("membresia", null);

let movimientos = leerLocal("historialMembresias", []);

if (!Array.isArray(movimientos)) {
    movimientos = [];
}

// No crear automáticamente una membresía.
// Si ya existe una, se conserva.

function guardarMembresia() {
    localStorage.setItem(
        "membresia",
        JSON.stringify(membresia)
    );
}

function guardarMovimientos() {
    localStorage.setItem(
        "historialMembresias",
        JSON.stringify(movimientos)
    );
}

// ========================================
// FECHAS
// ========================================

function fechaValida(valor) {
    if (!valor) return null;

    const fecha = new Date(valor);

    return Number.isNaN(fecha.getTime())
        ? null
        : fecha;
}

function calcularRenovacion(fecha, dias) {
    const nuevaFecha = new Date(fecha);

    // Sumar días completos de 24 horas.
    nuevaFecha.setTime(
        nuevaFecha.getTime() + dias * 24 * 60 * 60 * 1000
    );

    return nuevaFecha;
}

function formatearFecha(valor) {
    const fecha = fechaValida(valor);

    if (!fecha) return "-";

    return fecha.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).replace(".", "").toUpperCase();
}

function calcularDiasRestantes(vencimiento) {
    const fecha = fechaValida(vencimiento);

    if (!fecha) return null;

    const diferencia = fecha.getTime() - Date.now();

    if (diferencia <= 0) return 0;

    return Math.ceil(diferencia / (24 * 60 * 60 * 1000));
}

// ========================================
// ESTADO DE LA MEMBRESÍA
// ========================================

function obtenerEstadoMembresia() {
    if (!membresia || !planes[membresia.plan]) {
        return "sin-plan";
    }

    const vencimiento = fechaValida(
        membresia.fechaRenovacion
    );

    if (!vencimiento) {
        return "sin-fecha";
    }

    if (vencimiento.getTime() <= Date.now()) {
        return "vencida";
    }

    return "activa";
}

// ========================================
// MOSTRAR MEMBRESÍA ACTUAL
// ========================================

function mostrarMembresia() {
    const estado = obtenerEstadoMembresia();

    estadoPlanActual.classList.remove(
        "membresia-estado-activa",
        "membresia-estado-vencida",
        "membresia-estado-inactiva"
    );

    if (estado === "sin-plan") {
        nombrePlanActual.textContent = "Sin plan";
        precioPlanActual.textContent = "$0";
        periodoPlanActual.textContent = "-";

        descripcionPlanActual.textContent =
            "Selecciona una membresía para comenzar.";

        fechaInicio.textContent = "-";
        fechaRenovacion.textContent = "-";
        diasRestantes.textContent = "-";

        estadoPlanActual.textContent = "● SIN MEMBRESÍA";
        estadoMembresiaDato.textContent = "Sin membresía";

        estadoPlanActual.classList.add(
            "membresia-estado-inactiva"
        );

        botonRenovar.hidden = true;

        actualizarBotones();
        return;
    }

    const plan = planes[membresia.plan];

    nombrePlanActual.textContent = plan.nombre;
    precioPlanActual.textContent =
        "$" + plan.precio.toLocaleString("es-MX");

    periodoPlanActual.textContent = plan.periodo;
    descripcionPlanActual.textContent = plan.descripcion;

    fechaInicio.textContent = formatearFecha(
        membresia.fechaInicio
    );

    fechaRenovacion.textContent = formatearFecha(
        membresia.fechaRenovacion
    );

    const restantes = calcularDiasRestantes(
        membresia.fechaRenovacion
    );

    if (estado === "activa") {
        estadoPlanActual.textContent = "● MEMBRESÍA ACTIVA";
        estadoMembresiaDato.textContent = "Activa";

        diasRestantes.textContent =
            restantes === 1
                ? "1 día"
                : restantes + " días";

        estadoPlanActual.classList.add(
            "membresia-estado-activa"
        );
    } else if (estado === "vencida") {
        estadoPlanActual.textContent = "● MEMBRESÍA VENCIDA";
        estadoMembresiaDato.textContent = "Vencida";
        diasRestantes.textContent = "0 días";

        estadoPlanActual.classList.add(
            "membresia-estado-vencida"
        );
    } else {
        estadoPlanActual.textContent = "● FECHA NO DISPONIBLE";
        estadoMembresiaDato.textContent = "Por verificar";
        diasRestantes.textContent = "-";

        estadoPlanActual.classList.add(
            "membresia-estado-inactiva"
        );
    }

    botonRenovar.hidden = false;

    botonRenovar.textContent =
        estado === "activa"
            ? "Extender membresía"
            : "Renovar membresía";

    actualizarBotones();
}

// ========================================
// HISTORIAL DE MOVIMIENTOS
// ========================================

function registrarMovimiento(tipo, nombrePlan, inicio, fin) {
    const plan = planes[nombrePlan];

    movimientos.unshift({
        id: Date.now().toString() + "-" +
            Math.random().toString(36).slice(2, 8),

        tipo: tipo,
        plan: nombrePlan,
        nombrePlan: plan.nombre,
        monto: plan.precio,
        fecha: new Date().toISOString(),
        fechaInicio: inicio,
        fechaRenovacion: fin
    });
}

function mostrarHistorial() {
    historialMembresias.replaceChildren();

    if (movimientos.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "sin-movimientos";
        aviso.textContent =
            "Todavía no tienes movimientos registrados.";

        historialMembresias.appendChild(aviso);
        return;
    }

    const ordenados = [...movimientos].sort((a, b) => {
        return new Date(b.fecha || 0) - new Date(a.fecha || 0);
    });

    ordenados.forEach((movimiento) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "movimiento-membresia";

        const informacion = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent =
            movimiento.tipo || "Movimiento de membresía";

        const descripcion = document.createElement("p");
        descripcion.textContent =
            (movimiento.nombrePlan ||
                planes[movimiento.plan]?.nombre ||
                "Membresía") +
            " · " +
            formatearFecha(movimiento.fecha);

        const vigencia = document.createElement("p");
        vigencia.className = "vigencia-movimiento";
        vigencia.textContent =
            "Vigencia: " +
            formatearFecha(movimiento.fechaInicio) +
            " — " +
            formatearFecha(movimiento.fechaRenovacion);

        informacion.append(
            titulo,
            descripcion,
            vigencia
        );

        const importe = document.createElement("strong");

        importe.textContent =
            "$" + Number(movimiento.monto || 0)
                .toLocaleString("es-MX");

        tarjeta.append(informacion, importe);
        historialMembresias.appendChild(tarjeta);
    });
}

// ========================================
// GUARDAR OPERACIÓN
// ========================================

function realizarOperacion(nombrePlan, tipo, fechaBase) {
    const plan = planes[nombrePlan];

    if (!plan) return;

    const inicio = fechaBase || new Date();
    const vencimiento = calcularRenovacion(
        inicio,
        plan.dias
    );

    const nuevaMembresia = {
        plan: nombrePlan,
        fechaInicio: inicio.toISOString(),
        fechaRenovacion: vencimiento.toISOString()
    };

    // Preparar historial sin modificar el anterior.
    const movimientosAnteriores = [...movimientos];
    const membresiaAnterior = membresia;

    registrarMovimiento(
        tipo,
        nombrePlan,
        inicio.toISOString(),
        vencimiento.toISOString()
    );

    try {
        localStorage.setItem(
            "membresia",
            JSON.stringify(nuevaMembresia)
        );

        localStorage.setItem(
            "historialMembresias",
            JSON.stringify(movimientos)
        );

        membresia = nuevaMembresia;

        mostrarMembresia();
        mostrarHistorial();

        mensajeMembresia.textContent =
            "Operación de demostración registrada correctamente.";

    } catch (error) {
        // Restaurar la información en memoria.
        movimientos = movimientosAnteriores;
        membresia = membresiaAnterior;

        // Intentar restaurar la membresía persistida.
        try {
            if (membresiaAnterior) {
                guardarMembresia();
            } else {
                localStorage.removeItem("membresia");
            }

            guardarMovimientos();
        } catch (errorRestauracion) {
            console.error(
                "No se pudieron restaurar los datos:",
                errorRestauracion
            );
        }

        mensajeMembresia.textContent =
            "No se pudo guardar la operación. Inténtalo nuevamente.";
    }
}

// ========================================
// SELECCIONAR O CAMBIAR PLAN
// ========================================

function seleccionarPlan(nombrePlan) {
    const plan = planes[nombrePlan];

    if (!plan) return;

    const estado = obtenerEstadoMembresia();

    if (membresia?.plan === nombrePlan) {
        if (estado === "activa") {
            mensajeMembresia.textContent =
                "Este es tu plan actual. Puedes extenderlo " +
                "con el botón de renovación.";
            return;
        }

        renovarMembresia();
        return;
    }

    let tipo = "Activación";

    if (membresia && planes[membresia.plan]) {
        tipo = "Cambio de plan";
    }

    const advertencia = estado === "activa"
        ? "\nEl cambio comenzará hoy y reemplazará " +
          "la vigencia restante de tu plan actual."
        : "";

    const confirmar = window.confirm(
        "¿Deseas seleccionar " +
        plan.nombre +
        " por $" +
        plan.precio +
        "?" +
        advertencia +
        "\n\nEsta operación no genera un cobro real."
    );

    if (!confirmar) return;

    realizarOperacion(
        nombrePlan,
        tipo,
        new Date()
    );
}

// ========================================
// RENOVAR MEMBRESÍA
// ========================================

function renovarMembresia() {
    if (!membresia || !planes[membresia.plan]) {
        return;
    }

    const plan = planes[membresia.plan];
    const vencimiento = fechaValida(
        membresia.fechaRenovacion
    );

    // Si sigue activa, extender desde su vencimiento.
    // Si está vencida, comenzar desde hoy.
    const inicio =
        vencimiento && vencimiento > new Date()
            ? vencimiento
            : new Date();

    const confirmar = window.confirm(
        "¿Deseas " +
        (vencimiento && vencimiento > new Date()
            ? "extender"
            : "renovar") +
        " tu " +
        plan.nombre +
        " por $" +
        plan.precio +
        "?\n\nEsta operación no genera un cobro real."
    );

    if (!confirmar) return;

    const nuevaFechaFin = calcularRenovacion(
        inicio,
        plan.dias
    );

    // Conservar la fecha de inicio original
    // al extender una membresía activa.
    const fechaInicioOriginal =
        obtenerEstadoMembresia() === "activa"
            ? fechaValida(membresia.fechaInicio)
            : null;

    const nuevaMembresia = {
        plan: membresia.plan,
        fechaInicio: (
            fechaInicioOriginal || inicio
        ).toISOString(),
        fechaRenovacion: nuevaFechaFin.toISOString()
    };

    const anteriores = [...movimientos];
    const membresiaAnterior = membresia;

    registrarMovimiento(
        "Renovación",
        membresia.plan,
        inicio.toISOString(),
        nuevaFechaFin.toISOString()
    );

    try {
        localStorage.setItem(
            "membresia",
            JSON.stringify(nuevaMembresia)
        );

        localStorage.setItem(
            "historialMembresias",
            JSON.stringify(movimientos)
        );

        membresia = nuevaMembresia;

        mostrarMembresia();
        mostrarHistorial();

        mensajeMembresia.textContent =
            "Membresía renovada correctamente (demostración).";

    } catch (error) {
        membresia = membresiaAnterior;
        movimientos = anteriores;

        try {
            guardarMembresia();
            guardarMovimientos();
        } catch (errorRestauracion) {
            console.error(errorRestauracion);
        }

        mensajeMembresia.textContent =
            "No se pudo guardar la renovación.";
    }
}

// ========================================
// BOTONES DE PLANES
// ========================================

function actualizarBotones() {
    const estado = obtenerEstadoMembresia();

    document.querySelectorAll(".plan-membresia")
        .forEach((tarjeta) => {
            const nombrePlan = tarjeta.dataset.plan;

            const boton = tarjeta.querySelector(
                ".boton-elegir-plan"
            );

            tarjeta.classList.remove("plan-actual");

            if (!boton) return;

            if (
                membresia?.plan === nombrePlan &&
                estado === "activa"
            ) {
                tarjeta.classList.add("plan-actual");
                boton.textContent = "Plan actual";
                boton.disabled = true;
            } else if (
                membresia?.plan === nombrePlan
            ) {
                boton.textContent = "Renovar plan";
                boton.disabled = false;
            } else {
                boton.textContent = "Elegir plan";
                boton.disabled = false;
            }
        });
}

// ========================================
// EVENTOS
// ========================================

document.querySelectorAll(".plan-membresia")
    .forEach((tarjeta) => {
        const boton = tarjeta.querySelector(
            ".boton-elegir-plan"
        );

        if (!boton) return;

        boton.addEventListener("click", () => {
            seleccionarPlan(tarjeta.dataset.plan);
        });
    });

botonRenovar.addEventListener(
    "click",
    renovarMembresia
);

// ========================================
// INICIAR
// ========================================

mostrarMembresia();
mostrarHistorial();
