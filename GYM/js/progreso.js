// ==========================================================
// LUNAS GYM
// PROGRESO + HISTORIAL
// ==========================================================


// ==========================================================
// DATOS
// ==========================================================

let historial =
    JSON.parse(
        localStorage.getItem("historialEntrenamientos")
    ) || [];


// ==========================================================
// ELEMENTOS - ESTADÍSTICAS
// ==========================================================

const progresoEntrenamientos =
    document.getElementById("progresoEntrenamientos");

const progresoTiempo =
    document.getElementById("progresoTiempo");

const progresoSeries =
    document.getElementById("progresoSeries");

const progresoVolumen =
    document.getElementById("progresoVolumen");


// ==========================================================
// ELEMENTOS - RÉCORDS Y PROGRESO
// ==========================================================

const recordsEjercicios =
    document.getElementById("recordsEjercicios");

const seleccionarEjercicio =
    document.getElementById("seleccionarEjercicio");

const detalleProgresoEjercicio =
    document.getElementById("detalleProgresoEjercicio");

const mejorPeso =
    document.getElementById("mejorPeso");

const mejorVolumenEjercicio =
    document.getElementById("mejorVolumenEjercicio");

const vecesEntrenado =
    document.getElementById("vecesEntrenado");

const historialEjercicio =
    document.getElementById("historialEjercicio");

const sinProgreso =
    document.getElementById("sinProgreso");

const graficaProgreso =
    document.getElementById("graficaProgreso");

const nombreEjercicioGrafica =
    document.getElementById("nombreEjercicioGrafica");


// ==========================================================
// ELEMENTOS - HISTORIAL
// ==========================================================

const listaHistorial =
    document.getElementById("listaHistorial");

const historialVacio =
    document.getElementById("historialVacio");


// ==========================================================
// ELEMENTOS - MODAL
// ==========================================================

const modalHistorial =
    document.getElementById("modalHistorial");

const cerrarHistorial =
    document.getElementById("cerrarHistorial");

const modalNombre =
    document.getElementById("modalNombre");

const modalFecha =
    document.getElementById("modalFecha");

const resumenModal =
    document.getElementById("resumenModal");

const detalleEjercicios =
    document.getElementById("detalleEjercicios");


// ==========================================================
// FUNCIONES GENERALES
// ==========================================================

function formatearNumero(numero) {

    return Number(numero || 0)
        .toLocaleString("es-MX");

}


function formatearTiempo(milisegundos) {

    const minutosTotales =
        Math.floor(
            (milisegundos || 0) / 60000
        );


    const horas =
        Math.floor(
            minutosTotales / 60
        );


    const minutos =
        minutosTotales % 60;


    if (horas === 0) {

        return `${minutos} min`;

    }


    return `${horas} h ${minutos} min`;

}


function formatearDuracion(milisegundos) {

    const minutosTotales =
        Math.floor(
            (milisegundos || 0) / 60000
        );


    const horas =
        Math.floor(
            minutosTotales / 60
        );


    const minutos =
        minutosTotales % 60;


    if (horas > 0) {

        return `${horas} h ${minutos} min`;

    }


    if (minutos === 0) {

        return "< 1 min";

    }


    return `${minutos} min`;

}


// ==========================================================
// CONTAR SERIES COMPLETADAS
// ==========================================================

function contarSeries(entrenamiento) {

    let total = 0;


    entrenamiento.ejercicios.forEach(
        function (ejercicio) {

            ejercicio.series.forEach(
                function (serie) {

                    if (serie.completada) {

                        total++;

                    }

                }
            );

        }
    );


    return total;

}


// ==========================================================
// CALCULAR VOLUMEN
// ==========================================================

function calcularVolumen(entrenamiento) {

    let volumen = 0;


    entrenamiento.ejercicios.forEach(
        function (ejercicio) {

            ejercicio.series.forEach(
                function (serie) {

                    if (serie.completada) {

                        volumen +=
                            Number(serie.peso || 0) *
                            Number(serie.repeticiones || 0);

                    }

                }
            );

        }
    );


    return volumen;

}


// ==========================================================
// ESTADÍSTICAS GENERALES
// ==========================================================

function cargarEstadisticas() {

    let tiempo = 0;

    let series = 0;

    let volumen = 0;


    historial.forEach(
        function (entrenamiento) {

            tiempo +=
                entrenamiento.duracion || 0;

            series +=
                contarSeries(entrenamiento);

            volumen +=
                calcularVolumen(entrenamiento);

        }
    );


    progresoEntrenamientos.textContent =
        historial.length;


    progresoTiempo.textContent =
        formatearTiempo(tiempo);


    progresoSeries.textContent =
        series;


    progresoVolumen.textContent =
        formatearNumero(volumen) + " kg";

}


// ==========================================================
// OBTENER TODOS LOS EJERCICIOS
// ==========================================================

function obtenerEjercicios() {

    const ejercicios = {};


    historial.forEach(
        function (entrenamiento) {

            entrenamiento.ejercicios.forEach(
                function (ejercicio) {

                    const nombre =
                        ejercicio.nombre.trim();


                    const clave =
                        nombre.toLowerCase();


                    if (!ejercicios[clave]) {

                        ejercicios[clave] = {

                            nombre: nombre,

                            registros: []

                        };

                    }


                    let mejorPesoRegistro = 0;

                    let volumenRegistro = 0;

                    let seriesCompletadas = 0;


                    ejercicio.series.forEach(
                        function (serie) {

                            if (serie.completada) {

                                seriesCompletadas++;


                                const peso =
                                    Number(
                                        serie.peso || 0
                                    );


                                const reps =
                                    Number(
                                        serie.repeticiones || 0
                                    );


                                if (
                                    peso >
                                    mejorPesoRegistro
                                ) {

                                    mejorPesoRegistro =
                                        peso;

                                }


                                volumenRegistro +=
                                    peso * reps;

                            }

                        }
                    );


                    if (
                        seriesCompletadas > 0
                    ) {

                        ejercicios[
                            clave
                        ].registros.push({

                            fecha:
                                entrenamiento.fecha,

                            peso:
                                mejorPesoRegistro,

                            volumen:
                                volumenRegistro,

                            series:
                                seriesCompletadas

                        });

                    }

                }
            );

        }
    );


    return ejercicios;

}


// ==========================================================
// RÉCORDS
// ==========================================================

function mostrarRecords() {

    recordsEjercicios.innerHTML = "";


    const ejercicios =
        obtenerEjercicios();


    const claves =
        Object.keys(ejercicios);


    if (claves.length === 0) {

        recordsEjercicios.innerHTML = `

            <div class="actividad-vacia">

                Completa entrenamientos para
                comenzar a generar récords.

            </div>

        `;

        return;

    }


    claves
        .sort(function (a, b) {

            return ejercicios[a].nombre
                .localeCompare(
                    ejercicios[b].nombre
                );

        })
        .forEach(
            function (clave) {

                const ejercicio =
                    ejercicios[clave];


                let record = 0;


                ejercicio.registros.forEach(
                    function (registro) {

                        if (
                            registro.peso >
                            record
                        ) {

                            record =
                                registro.peso;

                        }

                    }
                );


                const tarjeta =
                    document.createElement(
                        "div"
                    );


                tarjeta.classList.add(
                    "record-ejercicio"
                );


                tarjeta.innerHTML = `

                    <span>
                        RÉCORD PERSONAL
                    </span>

                    <h3>
                        ${ejercicio.nombre}
                    </h3>

                    <strong>
                        ${formatearNumero(record)} kg
                    </strong>

                    <p>
                        Mejor peso registrado
                    </p>

                `;


                recordsEjercicios
                    .appendChild(
                        tarjeta
                    );

            }
        );

}


// ==========================================================
// CARGAR SELECTOR
// ==========================================================

function cargarSelector(
    conservarSeleccion = ""
) {

    const ejercicios =
        obtenerEjercicios();


    const claves =
        Object.keys(ejercicios);


    seleccionarEjercicio.innerHTML = `

        <option value="">
            Selecciona un ejercicio
        </option>

    `;


    if (claves.length === 0) {

        sinProgreso.classList.remove(
            "oculto"
        );

        detalleProgresoEjercicio
            .classList.add("oculto");

        return;

    }


    sinProgreso.classList.add(
        "oculto"
    );


    claves
        .sort(function (a, b) {

            return ejercicios[a].nombre
                .localeCompare(
                    ejercicios[b].nombre
                );

        })
        .forEach(
            function (clave) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    clave;


                opcion.textContent =
                    ejercicios[clave].nombre;


                seleccionarEjercicio
                    .appendChild(
                        opcion
                    );

            }
        );


    if (
        conservarSeleccion &&
        ejercicios[conservarSeleccion]
    ) {

        seleccionarEjercicio.value =
            conservarSeleccion;

        mostrarProgresoEjercicio(
            conservarSeleccion
        );

    }

}


// ==========================================================
// CAMBIAR EJERCICIO
// ==========================================================

seleccionarEjercicio.addEventListener(
    "change",
    function () {

        const clave =
            seleccionarEjercicio.value;


        if (clave === "") {

            detalleProgresoEjercicio
                .classList.add(
                    "oculto"
                );

            return;

        }


        mostrarProgresoEjercicio(
            clave
        );

    }
);


// ==========================================================
// MOSTRAR PROGRESO DE EJERCICIO
// ==========================================================

function mostrarProgresoEjercicio(clave) {

    const ejercicios =
        obtenerEjercicios();


    const ejercicio =
        ejercicios[clave];


    if (!ejercicio) {

        detalleProgresoEjercicio
            .classList.add("oculto");

        return;

    }


    detalleProgresoEjercicio
        .classList.remove(
            "oculto"
        );


    nombreEjercicioGrafica.textContent =
        ejercicio.nombre;


    const registros =
        [...ejercicio.registros]
            .sort(
                function (a, b) {

                    return (
                        new Date(a.fecha) -
                        new Date(b.fecha)
                    );

                }
            );


    let pesoMaximo = 0;

    let volumenMaximo = 0;


    registros.forEach(
        function (registro) {

            if (
                registro.peso >
                pesoMaximo
            ) {

                pesoMaximo =
                    registro.peso;

            }


            if (
                registro.volumen >
                volumenMaximo
            ) {

                volumenMaximo =
                    registro.volumen;

            }

        }
    );


    mejorPeso.textContent =
        formatearNumero(
            pesoMaximo
        ) + " kg";


    mejorVolumenEjercicio.textContent =
        formatearNumero(
            volumenMaximo
        ) + " kg";


    vecesEntrenado.textContent =
        registros.length;


    // TABLA:
    // más recientes primero

    historialEjercicio.innerHTML = "";


    [...registros]
        .reverse()
        .forEach(
            function (registro) {

                const fecha =
                    new Date(
                        registro.fecha
                    );


                const fila =
                    document.createElement(
                        "div"
                    );


                fila.classList.add(
                    "fila-progreso-ejercicio"
                );


                fila.innerHTML = `

                    <span>

                        ${fecha.toLocaleDateString(
                            "es-MX"
                        )}

                    </span>


                    <strong>

                        ${formatearNumero(
                            registro.peso
                        )} kg

                    </strong>


                    <span>

                        ${formatearNumero(
                            registro.volumen
                        )} kg

                    </span>


                    <span>

                        ${registro.series}

                    </span>

                `;


                historialEjercicio
                    .appendChild(
                        fila
                    );

            }
        );


    dibujarGrafica(
        registros
    );

}


// ==========================================================
// GRÁFICA DE PROGRESO
// ==========================================================

function dibujarGrafica(registros) {

    const canvas =
        graficaProgreso;


    const ctx =
        canvas.getContext("2d");


    // Ajustar resolución

    const ancho =
        Math.max(
            800,
            registros.length * 110
        );


    canvas.width =
        ancho;

    canvas.height =
        360;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (
        registros.length === 0
    ) {

        return;

    }


    // ------------------------------------------
    // MEDIDAS
    // ------------------------------------------

    const margenIzquierdo = 70;

    const margenDerecho = 35;

    const margenSuperior = 40;

    const margenInferior = 65;


    const anchoGrafica =
        canvas.width -
        margenIzquierdo -
        margenDerecho;


    const altoGrafica =
        canvas.height -
        margenSuperior -
        margenInferior;


    const pesos =
        registros.map(
            function (registro) {

                return registro.peso;

            }
        );


    let pesoMaximo =
        Math.max(...pesos);


    let pesoMinimo =
        Math.min(...pesos);


    // Evitar gráfica plana

    if (
        pesoMaximo === pesoMinimo
    ) {

        pesoMaximo += 10;

        pesoMinimo =
            Math.max(
                0,
                pesoMinimo - 10
            );

    } else {

        const margenPeso =
            Math.max(
                5,
                Math.ceil(
                    (
                        pesoMaximo -
                        pesoMinimo
                    ) * 0.15
                )
            );


        pesoMaximo +=
            margenPeso;


        pesoMinimo =
            Math.max(
                0,
                pesoMinimo -
                margenPeso
            );

    }


    // ------------------------------------------
    // FONDO
    // ------------------------------------------

    ctx.fillStyle =
        "#151515";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ------------------------------------------
    // LÍNEAS HORIZONTALES
    // ------------------------------------------

    const divisiones = 5;


    ctx.font =
        "12px Arial";


    ctx.textAlign =
        "right";


    ctx.textBaseline =
        "middle";


    for (
        let i = 0;
        i <= divisiones;
        i++
    ) {

        const porcentaje =
            i / divisiones;


        const y =
            margenSuperior +
            porcentaje *
            altoGrafica;


        const peso =
            pesoMaximo -
            porcentaje *
            (
                pesoMaximo -
                pesoMinimo
            );


        ctx.beginPath();


        ctx.strokeStyle =
            "#303030";


        ctx.lineWidth =
            1;


        ctx.moveTo(
            margenIzquierdo,
            y
        );


        ctx.lineTo(
            canvas.width -
            margenDerecho,
            y
        );


        ctx.stroke();


        ctx.fillStyle =
            "#999999";


        ctx.fillText(
            `${Math.round(peso)} kg`,
            margenIzquierdo - 12,
            y
        );

    }


    // ------------------------------------------
    // POSICIÓN DE PUNTOS
    // ------------------------------------------

    const puntos =
        registros.map(
            function (
                registro,
                indice
            ) {

                let x;


                if (
                    registros.length === 1
                ) {

                    x =
                        margenIzquierdo +
                        anchoGrafica / 2;

                } else {

                    x =
                        margenIzquierdo +
                        (
                            indice /
                            (
                                registros.length -
                                1
                            )
                        ) *
                        anchoGrafica;

                }


                const rango =
                    pesoMaximo -
                    pesoMinimo;


                const porcentaje =
                    rango === 0
                        ? 0.5
                        : (
                            registro.peso -
                            pesoMinimo
                        ) / rango;


                const y =
                    margenSuperior +
                    altoGrafica -
                    porcentaje *
                    altoGrafica;


                return {

                    x: x,

                    y: y,

                    registro: registro

                };

            }
        );


    // ------------------------------------------
    // LÍNEA
    // ------------------------------------------

    if (
        puntos.length > 1
    ) {

        ctx.beginPath();


        ctx.strokeStyle =
            "#ffb300";


        ctx.lineWidth =
            3;


        ctx.lineJoin =
            "round";


        ctx.lineCap =
            "round";


        puntos.forEach(
            function (
                punto,
                indice
            ) {

                if (
                    indice === 0
                ) {

                    ctx.moveTo(
                        punto.x,
                        punto.y
                    );

                } else {

                    ctx.lineTo(
                        punto.x,
                        punto.y
                    );

                }

            }
        );


        ctx.stroke();

    }


    // ------------------------------------------
    // PUNTOS Y FECHAS
    // ------------------------------------------

    puntos.forEach(
        function (punto) {

            const fecha =
                new Date(
                    punto.registro.fecha
                );


            // Punto exterior

            ctx.beginPath();

            ctx.fillStyle =
                "#ffb300";

            ctx.arc(
                punto.x,
                punto.y,
                6,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Centro

            ctx.beginPath();

            ctx.fillStyle =
                "#151515";

            ctx.arc(
                punto.x,
                punto.y,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Peso

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "bold 12px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                `${punto.registro.peso} kg`,
                punto.x,
                punto.y - 17
            );


            // Fecha

            ctx.fillStyle =
                "#999999";

            ctx.font =
                "11px Arial";


            const fechaTexto =
                fecha.toLocaleDateString(
                    "es-MX",
                    {
                        day: "2-digit",
                        month: "short"
                    }
                )
                .replace(".", "");


            ctx.fillText(
                fechaTexto,
                punto.x,
                canvas.height - 25
            );

        }
    );

}


// ==========================================================
// MOSTRAR HISTORIAL
// ==========================================================

function mostrarHistorial() {

    listaHistorial.innerHTML = "";


    if (
        historial.length === 0
    ) {

        historialVacio.classList.remove(
            "oculto"
        );

        return;

    }


    historialVacio.classList.add(
        "oculto"
    );


    const historialOrdenado =
        [...historial]
            .sort(
                function (a, b) {

                    return (
                        new Date(b.fecha) -
                        new Date(a.fecha)
                    );

                }
            );


    historialOrdenado.forEach(
        function (entrenamiento) {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.classList.add(
                "tarjeta-historial"
            );


            const fecha =
                new Date(
                    entrenamiento.fecha
                );


            const dia =
                fecha.getDate();


            const mes =
                fecha
                    .toLocaleDateString(
                        "es-MX",
                        {
                            month: "short"
                        }
                    )
                    .replace(".", "")
                    .toUpperCase();


            const año =
                fecha.getFullYear();


            const seriesCompletadas =
                contarSeries(
                    entrenamiento
                );


            const volumen =
                calcularVolumen(
                    entrenamiento
                );


            tarjeta.innerHTML = `

                <div class="fecha-tarjeta-historial">

                    <strong>
                        ${dia}
                    </strong>

                    <span>
                        ${mes}
                    </span>

                    <small>
                        ${año}
                    </small>

                </div>


                <div class="info-tarjeta-historial">

                    <span class="estado-entrenamiento">
                        COMPLETADO
                    </span>

                    <h2>
                        ${entrenamiento.nombre}
                    </h2>

                    <p>

                        ${entrenamiento.ejercicios.length}
                        ejercicios

                        •

                        ${seriesCompletadas}
                        series

                    </p>

                </div>


                <div class="datos-tarjeta-historial">

                    <div>

                        <span>
                            Duración
                        </span>

                        <strong>

                            ${formatearDuracion(
                                entrenamiento.duracion
                            )}

                        </strong>

                    </div>


                    <div>

                        <span>
                            Volumen
                        </span>

                        <strong>

                            ${formatearNumero(
                                volumen
                            )} kg

                        </strong>

                    </div>

                </div>


                <div class="acciones-historial">

                    <button
                        type="button"
                        class="ver-entrenamiento"
                        onclick="verEntrenamiento(${entrenamiento.id})">

                        Ver detalles

                    </button>


                    <button
                        type="button"
                        class="eliminar-entrenamiento"
                        onclick="eliminarEntrenamiento(${entrenamiento.id})">

                        Eliminar

                    </button>

                </div>

            `;


            listaHistorial
                .appendChild(
                    tarjeta
                );

        }
    );

}


// ==========================================================
// VER ENTRENAMIENTO
// ==========================================================

function verEntrenamiento(id) {

    const entrenamiento =
        historial.find(
            function (entrenamiento) {

                return (
                    entrenamiento.id === id
                );

            }
        );


    if (!entrenamiento) {

        return;

    }


    const fecha =
        new Date(
            entrenamiento.fecha
        );


    modalNombre.textContent =
        entrenamiento.nombre;


    modalFecha.textContent =
        fecha.toLocaleDateString(
            "es-MX",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const series =
        contarSeries(
            entrenamiento
        );


    const volumen =
        calcularVolumen(
            entrenamiento
        );


    resumenModal.innerHTML = `

        <div>

            <span>
                Duración
            </span>

            <strong>

                ${formatearDuracion(
                    entrenamiento.duracion
                )}

            </strong>

        </div>


        <div>

            <span>
                Ejercicios
            </span>

            <strong>

                ${entrenamiento.ejercicios.length}

            </strong>

        </div>


        <div>

            <span>
                Series
            </span>

            <strong>
                ${series}
            </strong>

        </div>


        <div>

            <span>
                Volumen
            </span>

            <strong>

                ${formatearNumero(
                    volumen
                )} kg

            </strong>

        </div>

    `;


    detalleEjercicios.innerHTML = "";


    entrenamiento.ejercicios.forEach(
        function (ejercicio) {

            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.classList.add(
                "detalle-ejercicio-historial"
            );


            let seriesHTML = "";


            ejercicio.series.forEach(
                function (
                    serie,
                    indice
                ) {

                    const estado =
                        serie.completada
                            ? "✓"
                            : "—";


                    seriesHTML += `

                        <div class="serie-historial">

                            <span>
                                ${indice + 1}
                            </span>

                            <span>
                                ${formatearNumero(
                                    serie.peso
                                )} kg
                            </span>

                            <span>
                                ${serie.repeticiones} reps
                            </span>

                            <strong>
                                ${estado}
                            </strong>

                        </div>

                    `;

                }
            );


            tarjeta.innerHTML = `

                <h3>
                    ${ejercicio.nombre}
                </h3>


                <div class="cabecera-series-historial">

                    <span>Serie</span>

                    <span>Peso</span>

                    <span>Reps</span>

                    <span>✓</span>

                </div>


                ${seriesHTML}

            `;


            detalleEjercicios
                .appendChild(
                    tarjeta
                );

        }
    );


    modalHistorial.classList.remove(
        "oculto"
    );

}


// ==========================================================
// CERRAR MODAL
// ==========================================================

cerrarHistorial.addEventListener(
    "click",
    function () {

        modalHistorial.classList.add(
            "oculto"
        );

    }
);


modalHistorial.addEventListener(
    "click",
    function (evento) {

        if (
            evento.target ===
            modalHistorial
        ) {

            modalHistorial.classList.add(
                "oculto"
            );

        }

    }
);


// ==========================================================
// ELIMINAR ENTRENAMIENTO
// ==========================================================

function eliminarEntrenamiento(id) {

    const entrenamiento =
        historial.find(
            function (entrenamiento) {

                return (
                    entrenamiento.id === id
                );

            }
        );


    if (!entrenamiento) {

        return;

    }


    const confirmar =
        confirm(
            `¿Seguro que quieres eliminar el entrenamiento "${entrenamiento.nombre}"?`
        );


    if (!confirmar) {

        return;

    }


    historial =
        historial.filter(
            function (entrenamiento) {

                return (
                    entrenamiento.id !== id
                );

            }
        );


    localStorage.setItem(
        "historialEntrenamientos",
        JSON.stringify(historial)
    );


    // Cerrar modal por si estaba abierto

    modalHistorial.classList.add(
        "oculto"
    );


    // Conservar ejercicio seleccionado

    const ejercicioSeleccionado =
        seleccionarEjercicio.value;


    // Actualizar TODO

    cargarEstadisticas();

    mostrarRecords();

    mostrarHistorial();

    cargarSelector(
        ejercicioSeleccionado
    );

}


// ==========================================================
// INICIALIZAR
// ==========================================================

function iniciarPagina() {

    cargarEstadisticas();

    mostrarRecords();

    cargarSelector();

    mostrarHistorial();

}


iniciarPagina();