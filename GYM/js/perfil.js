// ========================================
// LUNAS GYM - PERFIL DE USUARIO
// ========================================

// DATOS GUARDADOS
function leerDatos(clave, respaldo) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave));
        return datos ?? respaldo;
    } catch (error) {
        console.warn("Error leyendo:", clave);
        return respaldo;
    }
}

const usuario = leerDatos("usuario", {
    nombre: "Usuario",
    correo: "",
    telefono: ""
});

const rutinasGuardadas = leerDatos("rutinas", []);
const historialGuardado = leerDatos("historialEntrenamientos", []);

const rutinas = Array.isArray(rutinasGuardadas)
    ? rutinasGuardadas
    : [];

const historial = Array.isArray(historialGuardado)
    ? historialGuardado
    : [];

const membresia = leerDatos("membresia", null);

const elemento = (id) => document.getElementById(id);

function escribir(id, valor) {
    const destino = elemento(id);
    if (destino) destino.textContent = valor;
}

function crearElemento(etiqueta, clase, texto) {
    const nuevo = document.createElement(etiqueta);

    if (clase) nuevo.className = clase;
    if (texto !== undefined) nuevo.textContent = texto;

    return nuevo;
}

function obtenerEjercicios(registro) {
    return Array.isArray(registro?.ejercicios)
        ? registro.ejercicios
        : [];
}

function obtenerSeries(ejercicio) {
    return Array.isArray(ejercicio?.series)
        ? ejercicio.series
        : [];
}

function formatearTiempo(milisegundos) {
    const tiempo = Number(milisegundos) || 0;
    const minutosTotales = Math.floor(Math.max(0, tiempo) / 60000);
    const horas = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;

    if (horas === 0) return minutos + " min";
    return horas + " h " + minutos + " min";
}

function formatearFecha(valor) {
    if (!valor) return "-";

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return "-";

    return fecha.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).replace(".", "").toUpperCase();
}

// ========================================
// USUARIO
// ========================================
function cargarUsuario() {
    const nombre = usuario.nombre || "Usuario";

    escribir("nombreHeader", nombre);
    escribir("nombreBienvenida", nombre);
    escribir("avatarUsuario", nombre.charAt(0).toUpperCase());
}

// ========================================
// RESUMEN
// ========================================
function cargarResumen() {
    const tiempoTotal = historial.reduce((total, sesion) => {
        return total + (Number(sesion.duracion) || 0);
    }, 0);

    escribir("resumenEntrenamientos", historial.length);
    escribir("resumenTiempo", formatearTiempo(tiempoTotal));
    escribir("resumenRutinas", rutinas.length);
}

// ========================================
// RUTINAS GUARDADAS
// ========================================
function cargarRutinasPerfil() {
    const contenedor = elemento("rutinasPerfil");
    contenedor.replaceChildren();

    if (!rutinas.length) {
        const aviso = crearElemento(
            "div",
            "sin-rutinas-perfil"
        );

        aviso.appendChild(
            crearElemento(
                "p",
                "",
                "Todavía no tienes rutinas guardadas."
            )
        );

        const enlace = crearElemento(
            "a",
            "boton-secundario",
            "Crear mi primera rutina"
        );

        enlace.href = "entrenamiento.html";
        aviso.appendChild(enlace);
        contenedor.appendChild(aviso);
        return;
    }

    // Mostrar TODAS las rutinas guardadas.
    rutinas.forEach((rutina) => {
        const ejercicios = obtenerEjercicios(rutina);
        const tarjeta = crearElemento("div", "rutina");

        tarjeta.appendChild(
            crearElemento("span", "", "RUTINA")
        );

        tarjeta.appendChild(
            crearElemento("h3", "", rutina.nombre || "Rutina")
        );

        tarjeta.appendChild(
            crearElemento(
                "p",
                "",
                ejercicios.map((ejercicio) => ejercicio.nombre).join(" • ")
            )
        );

        tarjeta.appendChild(
            crearElemento(
                "strong",
                "",
                ejercicios.length + " ejercicios"
            )
        );

        // Iniciar directamente esta rutina.
        const iniciar = crearElemento(
            "a",
            "boton-perfil boton-iniciar-perfil",
            "▶ Iniciar entrenamiento"
        );

        iniciar.href =
            "entrenamiento.html?rutina=" +
            encodeURIComponent(rutina.id);

        tarjeta.appendChild(iniciar);
        contenedor.appendChild(tarjeta);
    });
}

// ========================================
// ENTRENAMIENTOS RECIENTES
// ========================================
function cargarEntrenamientosRecientes() {
    const contenedor = elemento("entrenamientosRecientes");
    contenedor.replaceChildren();

    if (!historial.length) {
        const aviso = crearElemento(
            "div",
            "sin-entrenamientos-perfil"
        );

        aviso.appendChild(
            crearElemento(
                "p",
                "",
                "Todavía no tienes entrenamientos registrados."
            )
        );

        contenedor.appendChild(aviso);
        return;
    }

    const recientes = [...historial]
        .sort((a, b) => {
            return new Date(b.fecha || 0) - new Date(a.fecha || 0);
        })
        .slice(0, 3);

    recientes.forEach((sesion) => {
        const ejercicios = obtenerEjercicios(sesion);

        const seriesCompletadas = ejercicios.reduce((total, ejercicio) => {
            return total + obtenerSeries(ejercicio)
                .filter((serie) => serie.completada).length;
        }, 0);

        const fecha = new Date(sesion.fecha);
        const fechaValida = !Number.isNaN(fecha.getTime());

        const tarjeta = crearElemento(
            "div",
            "entrenamiento-guardado"
        );

        const bloqueFecha = crearElemento(
            "div",
            "fecha-entrenamiento"
        );

        bloqueFecha.appendChild(
            crearElemento(
                "strong",
                "",
                fechaValida ? fecha.getDate() : "-"
            )
        );

        bloqueFecha.appendChild(
            crearElemento(
                "span",
                "",
                fechaValida
                    ? fecha.toLocaleDateString("es-MX", {
                        month: "short"
                    }).replace(".", "").toUpperCase()
                    : "-"
            )
        );

        const informacion = crearElemento(
            "div",
            "info-entrenamiento"
        );

        informacion.appendChild(
            crearElemento(
                "h3",
                "",
                sesion.nombre || "Entrenamiento"
            )
        );

        informacion.appendChild(
            crearElemento(
                "p",
                "",
                ejercicios.length + " ejercicios"
            )
        );

        const datos = crearElemento(
            "div",
            "datos-entrenamiento"
        );

        datos.appendChild(
            crearElemento(
                "span",
                "",
                formatearTiempo(sesion.duracion)
            )
        );

        datos.appendChild(
            crearElemento(
                "span",
                "",
                seriesCompletadas + " series"
            )
        );

        tarjeta.append(bloqueFecha, informacion, datos);
        contenedor.appendChild(tarjeta);
    });
}

// ========================================
// PROGRESO
// ========================================
function cargarProgreso() {
    let seriesTotal = 0;
    let volumenTotal = 0;

    historial.forEach((sesion) => {
        obtenerEjercicios(sesion).forEach((ejercicio) => {
            obtenerSeries(ejercicio).forEach((serie) => {
                if (!serie.completada) return;

                seriesTotal++;

                const peso = Number(serie.peso) || 0;
                const repeticiones = Number(serie.repeticiones) || 0;

                volumenTotal += peso * repeticiones;
            });
        });
    });

    escribir("progresoEntrenamientosPerfil", historial.length);
    escribir("progresoSeriesPerfil", seriesTotal);

    escribir(
        "progresoVolumenPerfil",
        volumenTotal.toLocaleString("es-MX") + " kg"
    );
}

// ========================================
// MEMBRESÍA
// ========================================
function cargarMembresia() {
    const planes = {
        visita: {
            nombre: "Acceso por día",
            precio: 50,
            descripcion: "Acceso completo durante un día."
        },
        mensual: {
            nombre: "Plan mensual",
            precio: 400,
            descripcion: "Acceso completo al gimnasio durante todo el mes."
        },
        trimestral: {
            nombre: "Plan trimestral",
            precio: 1000,
            descripcion: "Acceso completo al gimnasio durante tres meses."
        }
    };

    const plan = membresia ? planes[membresia.plan] : null;

    if (!plan) {
        escribir("resumenMembresia", "SIN PLAN");
        escribir("resumenPlan", "Sin membresía");
        escribir("estadoMembresiaPerfil", "● SIN MEMBRESÍA");
        escribir("planMembresiaPerfil", "Sin plan");

        escribir(
            "descripcionMembresiaPerfil",
            "Selecciona una membresía para comenzar."
        );

        escribir("renovacionMembresiaPerfil", "-");
        escribir("precioMembresiaPerfil", "$0");
        return;
    }

    const fechaRenovacion = membresia.fechaRenovacion
        ? new Date(membresia.fechaRenovacion)
        : null;

    const fechaValida = fechaRenovacion &&
        !Number.isNaN(fechaRenovacion.getTime());

    const vencida = fechaValida &&
        fechaRenovacion.getTime() < Date.now();

    escribir(
        "resumenMembresia",
        vencida ? "VENCIDA" : "ACTIVA"
    );

    escribir("resumenPlan", plan.nombre);

    escribir(
        "estadoMembresiaPerfil",
        vencida ? "● MEMBRESÍA VENCIDA" : "● MEMBRESÍA ACTIVA"
    );

    escribir("planMembresiaPerfil", plan.nombre);
    escribir("descripcionMembresiaPerfil", plan.descripcion);

    escribir(
        "precioMembresiaPerfil",
        "$" + plan.precio.toLocaleString("es-MX")
    );

    escribir(
        "renovacionMembresiaPerfil",
        fechaValida ? formatearFecha(fechaRenovacion) : "-"
    );
}

// ========================================
// OBJETIVOS PERSONALES
// ========================================
function iniciarObjetivosPersonales() {
    const clave = "objetivosPersonales";

    const valoresIniciales = {
        semanal: 3,
        total: 30,
        ejercicio: "Press banca",
        peso: 100
    };

    let objetivos = {
        ...valoresIniciales,
        ...leerDatos(clave, {})
    };

    function normalizar(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    function diasEntrenadosEstaSemana() {
        const hoy = new Date();

        const inicio = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
        );

        const diaSemana = (inicio.getDay() + 6) % 7;
        inicio.setDate(inicio.getDate() - diaSemana);

        const fin = new Date(inicio);
        fin.setDate(fin.getDate() + 7);

        const dias = new Set();

        historial.forEach((sesion) => {
            if (!sesion.fecha) return;

            const fecha = new Date(sesion.fecha);
            if (Number.isNaN(fecha.getTime())) return;
            if (fecha < inicio || fecha >= fin) return;

            const claveDia = [
                fecha.getFullYear(),
                fecha.getMonth(),
                fecha.getDate()
            ].join("-");

            dias.add(claveDia);
        });

        return dias.size;
    }

    function mejorMarcaEjercicio(nombreBuscado) {
        const buscado = normalizar(nombreBuscado);
        let maximo = 0;

        if (!buscado) return 0;

        historial.forEach((sesion) => {
            obtenerEjercicios(sesion).forEach((ejercicio) => {
                if (normalizar(ejercicio.nombre) !== buscado) return;

                obtenerSeries(ejercicio).forEach((serie) => {
                    if (!serie.completada) return;

                    const peso = Number(serie.peso);

                    if (Number.isFinite(peso) && peso > maximo) {
                        maximo = peso;
                    }
                });
            });
        });

        return maximo;
    }

    function actualizarBarra(id, actual, meta) {
        const barra = elemento(id);

        const porcentaje = meta > 0
            ? Math.min(100, Math.max(0, (actual / meta) * 100))
            : 0;

        barra.style.width = porcentaje + "%";

        barra.setAttribute(
            "aria-label",
            Math.round(porcentaje) + "% completado"
        );
    }

    function actualizarObjetivos() {
        const dias = diasEntrenadosEstaSemana();
        const sesiones = historial.length;
        const fuerza = mejorMarcaEjercicio(objetivos.ejercicio);

        escribir("objetivoSemanalActual", dias);
        escribir("objetivoSemanalMeta", objetivos.semanal);
        escribir("objetivoTotalActual", sesiones);
        escribir("objetivoTotalMeta", objetivos.total);

        escribir(
            "objetivoFuerzaActual",
            fuerza.toLocaleString("es-MX")
        );

        escribir(
            "objetivoFuerzaMeta",
            Number(objetivos.peso).toLocaleString("es-MX")
        );

        escribir(
            "textoObjetivoSemanal",
            "Días distintos entrenados esta semana (lunes a domingo)"
        );

        escribir(
            "textoObjetivoFuerza",
            objetivos.ejercicio + " · mejor serie completada"
        );

        actualizarBarra(
            "barraObjetivoSemanal",
            dias,
            Number(objetivos.semanal)
        );

        actualizarBarra(
            "barraObjetivoTotal",
            sesiones,
            Number(objetivos.total)
        );

        actualizarBarra(
            "barraObjetivoFuerza",
            fuerza,
            Number(objetivos.peso)
        );
    }

    const formulario = elemento("formObjetivos");

    elemento("editarObjetivos").addEventListener("click", () => {
        elemento("metaSemanal").value = objetivos.semanal;
        elemento("metaTotal").value = objetivos.total;
        elemento("metaEjercicio").value = objetivos.ejercicio;
        elemento("metaPeso").value = objetivos.peso;

        escribir("mensajeObjetivos", "");

        formulario.hidden = false;
        elemento("metaSemanal").focus();
    });

    elemento("cancelarObjetivos").addEventListener("click", () => {
        formulario.hidden = true;
    });

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const semanal = Number(elemento("metaSemanal").value);
        const total = Number(elemento("metaTotal").value);
        const ejercicio = elemento("metaEjercicio").value.trim();
        const peso = Number(elemento("metaPeso").value);

        const valido =
            Number.isInteger(semanal) &&
            semanal >= 1 &&
            semanal <= 7 &&
            Number.isInteger(total) &&
            total >= 1 &&
            total <= 100000 &&
            ejercicio.length > 0 &&
            Number.isFinite(peso) &&
            peso >= 0.5 &&
            peso <= 10000;

        if (!valido) {
            escribir(
                "mensajeObjetivos",
                "Revisa los valores de tus objetivos."
            );
            return;
        }

        const nuevosObjetivos = {
            semanal,
            total,
            ejercicio,
            peso
        };

        try {
            localStorage.setItem(
                clave,
                JSON.stringify(nuevosObjetivos)
            );

            objetivos = nuevosObjetivos;
            actualizarObjetivos();
            formulario.hidden = true;
        } catch (error) {
            escribir(
                "mensajeObjetivos",
                "No se pudieron guardar los objetivos."
            );
        }
    });

    actualizarObjetivos();
}

// ========================================
// INICIAR PERFIL
// ========================================
cargarUsuario();
cargarResumen();
cargarRutinasPerfil();
cargarEntrenamientosRecientes();
cargarProgreso();
cargarMembresia();
iniciarObjetivosPersonales();