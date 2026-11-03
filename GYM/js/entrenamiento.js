// ==========================================================
// LUNAS GYM
// RUTINAS + ENTRENAMIENTO + DESCANSO
// ==========================================================


// ==========================================================
// ELEMENTOS PRINCIPALES
// ==========================================================

const pantallaSeleccion =
    document.getElementById("pantallaSeleccion");

const pantallaEntrenamiento =
    document.getElementById("pantallaEntrenamiento");

const rutinasEntrenamiento =
    document.getElementById("rutinasEntrenamiento");

const sinRutinasEntrenamiento =
    document.getElementById("sinRutinasEntrenamiento");

const nombreEntrenamiento =
    document.getElementById("nombreEntrenamiento");

const ejerciciosEntrenamiento =
    document.getElementById("ejerciciosEntrenamiento");

const cronometro =
    document.getElementById("cronometro");

const finalizarEntrenamiento =
    document.getElementById("finalizarEntrenamiento");

const cancelarEntrenamiento =
    document.getElementById("cancelarEntrenamiento");


// ==========================================================
// ELEMENTOS DEL MODAL
// ==========================================================

const botonNuevaRutina =
    document.getElementById("botonNuevaRutina");

const crearPrimeraRutina =
    document.getElementById("crearPrimeraRutina");

const modalRutina =
    document.getElementById("modalRutina");

const cerrarModal =
    document.getElementById("cerrarModal");

const cancelarRutina =
    document.getElementById("cancelarRutina");

const guardarRutina =
    document.getElementById("guardarRutina");

const agregarEjercicio =
    document.getElementById("agregarEjercicio");

const listaEjercicios =
    document.getElementById("listaEjercicios");

const nombreRutina =
    document.getElementById("nombreRutina");

const tituloModalRutina =
    document.getElementById("tituloModalRutina");


// ==========================================================
// DESCANSO CONFIGURACIÓN
// ==========================================================

const descansoRutina =
    document.getElementById("descansoRutina");

const contenedorDescansoPersonalizado =
    document.getElementById(
        "contenedorDescansoPersonalizado"
    );

const descansoPersonalizado =
    document.getElementById(
        "descansoPersonalizado"
    );


// ==========================================================
// DESCANSO DURANTE ENTRENAMIENTO
// ==========================================================

const temporizadorDescanso =
    document.getElementById("temporizadorDescanso");

const tiempoDescanso =
    document.getElementById("tiempoDescanso");

const estadoDescanso =
    document.getElementById("estadoDescanso");

const agregarTiempoDescanso =
    document.getElementById(
        "agregarTiempoDescanso"
    );

const reiniciarDescanso =
    document.getElementById(
        "reiniciarDescanso"
    );

const omitirDescanso =
    document.getElementById(
        "omitirDescanso"
    );


// ==========================================================
// DATOS
// ==========================================================

let rutinas =
    JSON.parse(localStorage.getItem("rutinas")) || [];

let rutinaActual = null;

let rutinaEditandoId = null;


// ==========================================================
// VARIABLES DEL ENTRENAMIENTO
// ==========================================================

let inicioEntrenamiento = null;

let intervaloCronometro = null;


// ==========================================================
// VARIABLES DEL DESCANSO
// ==========================================================

let intervaloDescanso = null;

let segundosDescanso = 0;

let descansoOriginal = 120;


// ==========================================================
// MOSTRAR RUTINAS
// ==========================================================

function mostrarRutinas() {

    rutinasEntrenamiento.innerHTML = "";


    if (rutinas.length === 0) {

        sinRutinasEntrenamiento.classList.remove(
            "oculto"
        );

        return;

    }


    sinRutinasEntrenamiento.classList.add(
        "oculto"
    );


    rutinas.forEach(function (rutina) {

        const tarjeta =
            document.createElement("div");

        tarjeta.classList.add(
            "tarjeta-rutina-entrenamiento"
        );


        let ejerciciosHTML = "";


        rutina.ejercicios.forEach(
            function (ejercicio) {

                ejerciciosHTML += `

                    <li>

                        <span>
                            ${ejercicio.nombre}
                        </span>

                        <strong>
                            ${ejercicio.series}
                            ×
                            ${ejercicio.repeticiones}
                        </strong>

                    </li>

                `;

            }
        );


        const descanso =
            rutina.descanso || 120;


        tarjeta.innerHTML = `

            <div class="cabecera-rutina-entrenamiento">

                <div>

                    <span class="cantidad-ejercicios-rutina">

                        ${rutina.ejercicios.length}
                        ejercicios

                    </span>

                    <h2>
                        ${rutina.nombre}
                    </h2>

                </div>


                <span class="descanso-rutina">

                    Descanso:
                    ${formatearDescanso(descanso)}

                </span>

            </div>


            <ul class="ejercicios-rutina-entrenamiento">

                ${ejerciciosHTML}

            </ul>


            <div class="acciones-rutina-entrenamiento">

                <button
                    type="button"
                    class="boton-iniciar-rutina"
                    onclick="iniciarRutina(${rutina.id})">

                    ▶ Iniciar

                </button>


                <button
                    type="button"
                    class="boton-editar-rutina"
                    onclick="editarRutina(${rutina.id})">

                    Editar

                </button>


                <button
                    type="button"
                    class="boton-eliminar-rutina"
                    onclick="eliminarRutina(${rutina.id})">

                    Eliminar

                </button>

            </div>

        `;


        rutinasEntrenamiento.appendChild(
            tarjeta
        );

    });

}


// ==========================================================
// ABRIR MODAL PARA CREAR
// ==========================================================

function abrirNuevaRutina() {

    rutinaEditandoId = null;

    tituloModalRutina.textContent =
        "Crear rutina";

    guardarRutina.textContent =
        "Guardar rutina";

    limpiarFormulario();

    modalRutina.classList.remove("oculto");

}


botonNuevaRutina.addEventListener(
    "click",
    abrirNuevaRutina
);


crearPrimeraRutina.addEventListener(
    "click",
    abrirNuevaRutina
);


// ==========================================================
// CERRAR MODAL
// ==========================================================

function cerrarVentana() {

    modalRutina.classList.add("oculto");

    rutinaEditandoId = null;

}


cerrarModal.addEventListener(
    "click",
    cerrarVentana
);


cancelarRutina.addEventListener(
    "click",
    cerrarVentana
);


// Cerrar haciendo clic fuera

modalRutina.addEventListener(
    "click",
    function (evento) {

        if (evento.target === modalRutina) {

            cerrarVentana();

        }

    }
);


// ==========================================================
// DESCANSO PERSONALIZADO
// ==========================================================

descansoRutina.addEventListener(
    "change",
    function () {

        if (
            descansoRutina.value ===
            "personalizado"
        ) {

            contenedorDescansoPersonalizado
                .classList.remove("oculto");

        } else {

            contenedorDescansoPersonalizado
                .classList.add("oculto");

        }

    }
);


// ==========================================================
// CREAR HTML DE EJERCICIO
// ==========================================================

function crearEjercicioFormulario(
    nombre = "",
    series = 3,
    repeticiones = 10
) {

    const ejercicio =
        document.createElement("div");


    ejercicio.classList.add(
        "ejercicio-rutina"
    );


    ejercicio.innerHTML = `

        <div class="campo-ejercicio nombre-ejercicio">

            <label>
                Ejercicio
            </label>

            <input
                type="text"
                class="nombreEjercicio"
                placeholder="Ej. Press banca"
                value="${nombre}">

        </div>


        <div class="campo-ejercicio">

            <label>
                Series
            </label>

            <input
                type="number"
                class="seriesEjercicio"
                value="${series}"
                min="1">

        </div>


        <div class="campo-ejercicio">

            <label>
                Repeticiones
            </label>

            <input
                type="number"
                class="repeticionesEjercicio"
                value="${repeticiones}"
                min="1">

        </div>


        <button
            type="button"
            class="eliminar-ejercicio">

            ×

        </button>

    `;


    return ejercicio;

}


// ==========================================================
// AGREGAR EJERCICIO
// ==========================================================

agregarEjercicio.addEventListener(
    "click",
    function () {

        listaEjercicios.appendChild(
            crearEjercicioFormulario()
        );

    }
);


// ==========================================================
// ELIMINAR EJERCICIO DEL FORMULARIO
// ==========================================================

listaEjercicios.addEventListener(
    "click",
    function (evento) {

        if (
            evento.target.classList.contains(
                "eliminar-ejercicio"
            )
        ) {

            evento.target
                .closest(".ejercicio-rutina")
                .remove();

        }

    }
);


// ==========================================================
// LIMPIAR FORMULARIO
// ==========================================================

function limpiarFormulario() {

    nombreRutina.value = "";

    descansoRutina.value = "120";

    descansoPersonalizado.value = "120";

    contenedorDescansoPersonalizado
        .classList.add("oculto");


    listaEjercicios.innerHTML = "";


    listaEjercicios.appendChild(
        crearEjercicioFormulario()
    );

}


// ==========================================================
// OBTENER DESCANSO DEL FORMULARIO
// ==========================================================

function obtenerDescansoFormulario() {

    if (
        descansoRutina.value ===
        "personalizado"
    ) {

        let segundos =
            Number(
                descansoPersonalizado.value
            );


        if (
            !Number.isFinite(segundos) ||
            segundos < 10
        ) {

            segundos = 10;

        }


        if (segundos > 900) {

            segundos = 900;

        }


        return segundos;

    }


    return Number(descansoRutina.value);

}


// ==========================================================
// GUARDAR / EDITAR RUTINA
// ==========================================================

guardarRutina.addEventListener(
    "click",
    function () {

        const nombre =
            nombreRutina.value.trim();


        if (nombre === "") {

            alert(
                "Escribe un nombre para la rutina."
            );

            return;

        }


        const filas =
            listaEjercicios.querySelectorAll(
                ".ejercicio-rutina"
            );


        const ejercicios = [];


        filas.forEach(function (fila) {

            const nombreEjercicio =
                fila.querySelector(
                    ".nombreEjercicio"
                ).value.trim();


            const series =
                Number(
                    fila.querySelector(
                        ".seriesEjercicio"
                    ).value
                );


            const repeticiones =
                Number(
                    fila.querySelector(
                        ".repeticionesEjercicio"
                    ).value
                );


            if (
                nombreEjercicio !== "" &&
                series > 0 &&
                repeticiones > 0
            ) {

                ejercicios.push({

                    nombre: nombreEjercicio,

                    series: series,

                    repeticiones: repeticiones

                });

            }

        });


        if (ejercicios.length === 0) {

            alert(
                "Agrega al menos un ejercicio válido."
            );

            return;

        }


        const descanso =
            obtenerDescansoFormulario();


        // EDITAR

        if (rutinaEditandoId !== null) {

            const indice =
                rutinas.findIndex(
                    function (rutina) {

                        return (
                            rutina.id ===
                            rutinaEditandoId
                        );

                    }
                );


            if (indice !== -1) {

                rutinas[indice] = {

                    ...rutinas[indice],

                    nombre: nombre,

                    descanso: descanso,

                    ejercicios: ejercicios

                };

            }

        }

        // CREAR

        else {

            const nuevaRutina = {

                id: Date.now(),

                nombre: nombre,

                descanso: descanso,

                ejercicios: ejercicios

            };


            rutinas.push(nuevaRutina);

        }


        guardarRutinas();


        cerrarVentana();

        limpiarFormulario();

        mostrarRutinas();

    }
);


// ==========================================================
// GUARDAR RUTINAS EN LOCALSTORAGE
// ==========================================================

function guardarRutinas() {

    localStorage.setItem(
        "rutinas",
        JSON.stringify(rutinas)
    );

}


// ==========================================================
// EDITAR RUTINA
// ==========================================================

function editarRutina(id) {

    const rutina =
        rutinas.find(
            function (rutina) {

                return rutina.id === id;

            }
        );


    if (!rutina) {

        return;

    }


    rutinaEditandoId = id;


    tituloModalRutina.textContent =
        "Editar rutina";


    guardarRutina.textContent =
        "Guardar cambios";


    nombreRutina.value =
        rutina.nombre;


    const descanso =
        rutina.descanso || 120;


    const opcionesNormales =
        [60, 90, 120, 180];


    if (
        opcionesNormales.includes(descanso)
    ) {

        descansoRutina.value =
            String(descanso);

        contenedorDescansoPersonalizado
            .classList.add("oculto");

    } else {

        descansoRutina.value =
            "personalizado";

        descansoPersonalizado.value =
            descanso;

        contenedorDescansoPersonalizado
            .classList.remove("oculto");

    }


    listaEjercicios.innerHTML = "";


    rutina.ejercicios.forEach(
        function (ejercicio) {

            listaEjercicios.appendChild(

                crearEjercicioFormulario(

                    ejercicio.nombre,

                    ejercicio.series,

                    ejercicio.repeticiones

                )

            );

        }
    );


    modalRutina.classList.remove(
        "oculto"
    );

}


// ==========================================================
// ELIMINAR RUTINA
// ==========================================================

function eliminarRutina(id) {

    const rutina =
        rutinas.find(
            function (rutina) {

                return rutina.id === id;

            }
        );


    if (!rutina) {

        return;

    }


    const confirmar =
        confirm(
            `¿Seguro que quieres eliminar la rutina "${rutina.nombre}"?`
        );


    if (!confirmar) {

        return;

    }


    rutinas =
        rutinas.filter(
            function (rutina) {

                return rutina.id !== id;

            }
        );


    guardarRutinas();

    mostrarRutinas();

}


// ==========================================================
// INICIAR RUTINA
// ==========================================================

function iniciarRutina(id) {

    rutinaActual =
        rutinas.find(
            function (rutina) {

                return rutina.id === id;

            }
        );


    if (!rutinaActual) {

        return;

    }


    pantallaSeleccion.classList.add(
        "oculto"
    );


    pantallaEntrenamiento.classList.remove(
        "oculto"
    );


    nombreEntrenamiento.textContent =
        rutinaActual.nombre;


    descansoOriginal =
        rutinaActual.descanso || 120;


    detenerDescanso();


    temporizadorDescanso.classList.add(
        "oculto"
    );


    crearEjercicios();


    inicioEntrenamiento =
        Date.now();


    iniciarCronometro();

}


// ==========================================================
// CREAR EJERCICIOS DEL ENTRENAMIENTO
// ==========================================================

function crearEjercicios() {

    ejerciciosEntrenamiento.innerHTML = "";


    rutinaActual.ejercicios.forEach(
        function (
            ejercicio,
            indiceEjercicio
        ) {

            const tarjeta =
                document.createElement("div");


            tarjeta.classList.add(
                "ejercicio-entrenamiento"
            );


            let seriesHTML = "";


            for (
                let i = 1;
                i <= ejercicio.series;
                i++
            ) {

                seriesHTML +=
                    crearSerieHTML(
                        i,
                        ejercicio.repeticiones
                    );

            }


            tarjeta.innerHTML = `

                <div class="titulo-ejercicio-entrenamiento">

                    <div>

                        <span>

                            EJERCICIO
                            ${indiceEjercicio + 1}

                        </span>

                        <h2>

                            ${ejercicio.nombre}

                        </h2>

                    </div>

                </div>


                <div class="tabla-series">

                    <div class="encabezado-serie">

                        <span>SERIE</span>

                        <span>KG</span>

                        <span>REPS</span>

                        <span>✓</span>

                    </div>


                    <div
                        class="series-ejercicio"
                        data-ejercicio="${indiceEjercicio}">

                        ${seriesHTML}

                    </div>

                </div>


                <button
                    type="button"
                    class="agregar-serie"
                    onclick="agregarSerie(${indiceEjercicio})">

                    + Agregar serie

                </button>

            `;


            ejerciciosEntrenamiento.appendChild(
                tarjeta
            );

        }
    );

}


// ==========================================================
// CREAR SERIE
// ==========================================================

function crearSerieHTML(
    numero,
    repeticiones
) {

    return `

        <div class="fila-serie">

            <strong class="numero-serie">

                ${numero}

            </strong>


            <input
                type="number"
                class="peso-serie"
                placeholder="0"
                min="0"
                step="0.5">


            <input
                type="number"
                class="reps-serie"
                value="${repeticiones}"
                min="0">


            <input
                type="checkbox"
                class="serie-completada">

        </div>

    `;

}


// ==========================================================
// AGREGAR SERIE
// ==========================================================

function agregarSerie(indiceEjercicio) {

    const contenedor =
        document.querySelector(
            `[data-ejercicio="${indiceEjercicio}"]`
        );


    if (!contenedor) {

        return;

    }


    const numero =
        contenedor.querySelectorAll(
            ".fila-serie"
        ).length + 1;


    const ejercicio =
        rutinaActual.ejercicios[
            indiceEjercicio
        ];


    contenedor.insertAdjacentHTML(

        "beforeend",

        crearSerieHTML(
            numero,
            ejercicio.repeticiones
        )

    );

}


// ==========================================================
// DETECTAR SERIE COMPLETADA
// ==========================================================

ejerciciosEntrenamiento.addEventListener(
    "change",
    function (evento) {

        if (
            !evento.target.classList.contains(
                "serie-completada"
            )
        ) {

            return;

        }


        // Solo iniciar descanso cuando se marca,
        // no cuando se desmarca.

        if (evento.target.checked) {

            iniciarDescanso();

        }

    }
);


// ==========================================================
// CRONÓMETRO GENERAL
// ==========================================================

function iniciarCronometro() {

    clearInterval(
        intervaloCronometro
    );


    actualizarCronometro();


    intervaloCronometro =
        setInterval(
            actualizarCronometro,
            1000
        );

}


function actualizarCronometro() {

    if (!inicioEntrenamiento) {

        return;

    }


    const diferencia =
        Date.now() -
        inicioEntrenamiento;


    const segundosTotales =
        Math.floor(
            diferencia / 1000
        );


    const horas =
        Math.floor(
            segundosTotales / 3600
        );


    const minutos =
        Math.floor(
            (
                segundosTotales %
                3600
            ) / 60
        );


    const segundos =
        segundosTotales % 60;


    cronometro.textContent =

        `${formatoTiempo(horas)}:` +
        `${formatoTiempo(minutos)}:` +
        `${formatoTiempo(segundos)}`;

}


// ==========================================================
// DESCANSO
// ==========================================================

function iniciarDescanso() {

    detenerDescanso();


    segundosDescanso =
        descansoOriginal;


    temporizadorDescanso.classList.remove(
        "oculto"
    );


    estadoDescanso.textContent =
        "Descansando...";


    actualizarPantallaDescanso();


    intervaloDescanso =
        setInterval(
            function () {

                segundosDescanso--;


                if (
                    segundosDescanso <= 0
                ) {

                    segundosDescanso = 0;

                    actualizarPantallaDescanso();

                    finalizarDescanso();

                    return;

                }


                actualizarPantallaDescanso();

            },
            1000
        );

}


// ==========================================================
// ACTUALIZAR DESCANSO
// ==========================================================

function actualizarPantallaDescanso() {

    const minutos =
        Math.floor(
            segundosDescanso / 60
        );


    const segundos =
        segundosDescanso % 60;


    tiempoDescanso.textContent =

        `${formatoTiempo(minutos)}:` +
        `${formatoTiempo(segundos)}`;

}


// ==========================================================
// FINALIZAR DESCANSO
// ==========================================================

function finalizarDescanso() {

    detenerDescanso();


    segundosDescanso = 0;


    actualizarPantallaDescanso();


    estadoDescanso.textContent =
        "¡Descanso terminado!";


    temporizadorDescanso.classList.add(
        "descanso-terminado"
    );

}


// ==========================================================
// DETENER INTERVALO DE DESCANSO
// ==========================================================

function detenerDescanso() {

    clearInterval(
        intervaloDescanso
    );


    intervaloDescanso = null;


    temporizadorDescanso.classList.remove(
        "descanso-terminado"
    );

}


// ==========================================================
// +30 SEGUNDOS
// ==========================================================

agregarTiempoDescanso.addEventListener(
    "click",
    function () {

        segundosDescanso += 30;


        temporizadorDescanso.classList.remove(
            "oculto"
        );


        estadoDescanso.textContent =
            "Descansando...";


        actualizarPantallaDescanso();


        // Si había terminado, volver a arrancarlo.

        if (!intervaloDescanso) {

            intervaloDescanso =
                setInterval(
                    function () {

                        segundosDescanso--;


                        if (
                            segundosDescanso <= 0
                        ) {

                            segundosDescanso = 0;

                            actualizarPantallaDescanso();

                            finalizarDescanso();

                            return;

                        }


                        actualizarPantallaDescanso();

                    },
                    1000
                );

        }

    }
);


// ==========================================================
// REINICIAR DESCANSO
// ==========================================================

reiniciarDescanso.addEventListener(
    "click",
    function () {

        iniciarDescanso();

    }
);


// ==========================================================
// OMITIR DESCANSO
// ==========================================================

omitirDescanso.addEventListener(
    "click",
    function () {

        detenerDescanso();


        segundosDescanso = 0;


        actualizarPantallaDescanso();


        temporizadorDescanso.classList.add(
            "oculto"
        );

    }
);


// ==========================================================
// FORMATO 00
// ==========================================================

function formatoTiempo(numero) {

    return String(numero)
        .padStart(2, "0");

}


// ==========================================================
// FORMATEAR DESCANSO
// ==========================================================

function formatearDescanso(segundos) {

    const minutos =
        Math.floor(
            segundos / 60
        );


    const segundosRestantes =
        segundos % 60;


    return (

        `${formatoTiempo(minutos)}:` +
        `${formatoTiempo(segundosRestantes)}`

    );

}


// ==========================================================
// FINALIZAR ENTRENAMIENTO
// ==========================================================

finalizarEntrenamiento.addEventListener(
    "click",
    function () {

        if (!rutinaActual) {

            return;

        }


        const confirmar =
            confirm(
                "¿Quieres finalizar y guardar el entrenamiento?"
            );


        if (!confirmar) {

            return;

        }


        guardarEntrenamiento();

    }
);


// ==========================================================
// GUARDAR ENTRENAMIENTO
// ==========================================================

function guardarEntrenamiento() {

    clearInterval(
        intervaloCronometro
    );


    detenerDescanso();


    const ejerciciosGuardados = [];


    const tarjetas =
        document.querySelectorAll(
            ".ejercicio-entrenamiento"
        );


    tarjetas.forEach(
        function (tarjeta, indice) {

            const ejercicio =
                rutinaActual.ejercicios[
                    indice
                ];


            const filas =
                tarjeta.querySelectorAll(
                    ".fila-serie"
                );


            const series = [];


            filas.forEach(
                function (fila) {

                    const peso =
                        Number(
                            fila.querySelector(
                                ".peso-serie"
                            ).value
                        ) || 0;


                    const reps =
                        Number(
                            fila.querySelector(
                                ".reps-serie"
                            ).value
                        ) || 0;


                    const completada =
                        fila.querySelector(
                            ".serie-completada"
                        ).checked;


                    series.push({

                        peso: peso,

                        repeticiones: reps,

                        completada: completada

                    });

                }
            );


            ejerciciosGuardados.push({

                nombre:
                    ejercicio.nombre,

                series:
                    series

            });

        }
    );


    const duracion =
        Date.now() -
        inicioEntrenamiento;


    const entrenamiento = {

        id: Date.now(),

        rutinaId:
            rutinaActual.id,

        nombre:
            rutinaActual.nombre,

        fecha:
            new Date().toISOString(),

        duracion:
            duracion,

        ejercicios:
            ejerciciosGuardados

    };


    const historial =
        JSON.parse(
            localStorage.getItem(
                "historialEntrenamientos"
            )
        ) || [];


    historial.push(
        entrenamiento
    );


    localStorage.setItem(

        "historialEntrenamientos",

        JSON.stringify(
            historial
        )

    );


    alert(
        "Entrenamiento guardado correctamente."
    );


    window.location.href =
        "perfil.html";

}


// ==========================================================
// CANCELAR ENTRENAMIENTO
// ==========================================================

cancelarEntrenamiento.addEventListener(
    "click",
    function () {

        const confirmar =
            confirm(
                "¿Seguro que quieres cancelar? El entrenamiento no se guardará."
            );


        if (!confirmar) {

            return;

        }


        clearInterval(
            intervaloCronometro
        );


        detenerDescanso();


        rutinaActual = null;

        inicioEntrenamiento = null;


        cronometro.textContent =
            "00:00:00";


        temporizadorDescanso.classList.add(
            "oculto"
        );


        pantallaEntrenamiento.classList.add(
            "oculto"
        );


        pantallaSeleccion.classList.remove(
            "oculto"
        );

    }
);


// ==========================================================
// CARGAR PÁGINA
// ==========================================================

mostrarRutinas();

// INICIAR RUTINA DESDE EL PERFIL

function iniciarRutinaDesdePerfil() {
    const parametros = new URLSearchParams(window.location.search);
    const rutinaId = parametros.get("rutina");

    // Si entramos normalmente a entrenamiento.html,
    // mostramos la pantalla de selección de siempre.
    if (rutinaId === null) {
        return;
    }

    // Buscar la rutina seleccionada en el perfil.
    const rutinaSeleccionada = rutinas.find(function (rutina) {
        return String(rutina.id) === rutinaId;
    });

    if (!rutinaSeleccionada) {
        console.warn("No se encontró la rutina seleccionada.");
        return;
    }

    // Utilizamos la función original del sistema.
    iniciarRutina(rutinaSeleccionada.id);
}

// Ejecutar después de cargar las rutinas.
iniciarRutinaDesdePerfil();