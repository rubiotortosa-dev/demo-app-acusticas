/* =========================================================
   ADAPTACIÓN DEMO ONLINE
   ========================================================= */


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "[DEMO] Inicializando aplicación online..."
    );

    inicializarDemoOnline();

});


function inicializarDemoOnline() {

    const tablaInterior =
        document.querySelector("#tablaInterior tbody");

    const tablaExterior =
        document.querySelector("#tablaExterior tbody");


    if (
        tablaInterior &&
        tablaInterior.children.length === 0
    ) {

        anadirMedidaInterior();

    }


    if (
        tablaExterior &&
        tablaExterior.children.length === 0
    ) {

        anadirMedidaExterior();

    }


    actualizarResumenDemo();

}


/* =========================================================
   MEDICIÓN INTERIOR
   ========================================================= */

function anadirMedidaInterior() {

    const tabla =
        document.querySelector(
            "#tablaInterior tbody"
        );


    if (!tabla) {

        console.error(
            "[DEMO] No se encuentra la tabla interior."
        );

        return;

    }


    const fila =
        document.createElement("tr");


    fila.innerHTML = `

        <td>
            <input
                type="text"
                class="campo-instalacion"
                placeholder="Instalación"
            >
        </td>


        <td>
            <input
                type="text"
                class="campo-vivienda"
                placeholder="Vivienda"
            >
        </td>


        <td>

            <select
                class="campo-estancia"
                onchange="
                    actualizarLimiteInterior(this);
                    actualizarResumenDemo();
                "
            >

                <option value="">
                    Seleccionar
                </option>

                <option value="salon">
                    Salón
                </option>

                <option value="oficina">
                    Oficina
                </option>

                <option value="dormitorio">
                    Dormitorio
                </option>

            </select>

        </td>


        <td>

            <select
                class="campo-periodo"
                onchange="
                    actualizarLimiteInterior(this);
                    actualizarResumenDemo();
                "
            >

                <option value="">
                    Seleccionar
                </option>

                <option value="Día">
                    Día
                </option>

                <option value="Vespertino">
                    Vespertino
                </option>

                <option value="Nocturno">
                    Nocturno
                </option>

            </select>

        </td>


        <td>

            <input
                type="number"
                step="0.1"
                min="0"
                class="campo-valor"
                placeholder="dB"
                oninput="
                    actualizarResultado(this.closest('tr'));
                    actualizarResumenDemo();
                "
            >

        </td>


        <td class="limite">
            —
        </td>


        <td class="resultado">
            —
        </td>


        <td>

            <button
                type="button"
                class="boton-eliminar"
                onclick="
                    eliminarMedida(this);
                    actualizarResumenDemo();
                "
                title="Eliminar medición"
            >
                ×
            </button>

        </td>

    `;


    tabla.appendChild(fila);


    actualizarResumenDemo();

}


/* =========================================================
   MEDICIÓN EXTERIOR
   ========================================================= */

function anadirMedidaExterior() {

    const tabla =
        document.querySelector(
            "#tablaExterior tbody"
        );


    if (!tabla) {

        console.error(
            "[DEMO] No se encuentra la tabla exterior."
        );

        return;

    }


    const fila =
        document.createElement("tr");


    fila.innerHTML = `

        <td>

            <input
                type="text"
                class="campo-instalacion"
                placeholder="Instalación"
            >

        </td>


        <td>

            <input
                type="text"
                class="campo-vivienda"
                placeholder="Vivienda"
            >

        </td>


        <td>

            <input
                type="text"
                class="campo-zona"
                placeholder="Zona exterior"
            >

        </td>


        <td>

            <select
                class="campo-periodo"
                onchange="
                    actualizarLimiteExterior(this);
                    actualizarResumenDemo();
                "
            >

                <option value="">
                    Seleccionar
                </option>

                <option value="Día">
                    Día
                </option>

                <option value="Vespertino">
                    Vespertino
                </option>

                <option value="Nocturno">
                    Nocturno
                </option>

            </select>

        </td>


        <td>

            <input
                type="number"
                step="0.1"
                min="0"
                class="campo-valor"
                placeholder="dB"
                oninput="
                    actualizarResultadoExterior(this.closest('tr'));
                    actualizarResumenDemo();
                "
            >

        </td>


        <td class="limite">
            —
        </td>


        <td class="resultado">
            —
        </td>


        <td>

            <button
                type="button"
                class="boton-eliminar"
                onclick="
                    eliminarMedida(this);
                    actualizarResumenDemo();
                "
                title="Eliminar medición"
            >
                ×
            </button>

        </td>

    `;


    tabla.appendChild(fila);


    actualizarResumenDemo();

}


/* =========================================================
   LÍMITE INTERIOR
   ========================================================= */

function actualizarLimiteInterior(elemento) {

    const fila =
        elemento.closest("tr");


    if (!fila) {
        return;
    }


    const estancia =
        fila.querySelector(
            ".campo-estancia"
        )?.value || "";


    const periodo =
        fila.querySelector(
            ".campo-periodo"
        )?.value || "";


    const limiteCelda =
        fila.querySelector(
            ".limite"
        );


    let limite = null;


    if (
        estancia === "salon" ||
        estancia === "oficina"
    ) {

        if (
            periodo === "Día" ||
            periodo === "Vespertino"
        ) {

            limite = 45;

        }


        if (
            periodo === "Nocturno"
        ) {

            limite = 35;

        }

    }


    if (
        estancia === "dormitorio"
    ) {

        if (
            periodo === "Día" ||
            periodo === "Vespertino"
        ) {

            limite = 40;

        }


        if (
            periodo === "Nocturno"
        ) {

            limite = 30;

        }

    }


    if (limite === null) {

        limiteCelda.textContent = "—";

    }
    else {

        limiteCelda.textContent =
            limite + " dB";

    }


    actualizarResultado(fila);

    actualizarResumenDemo();

}


/* =========================================================
   RESULTADO INTERIOR
   ========================================================= */

function actualizarResultado(fila) {

    if (!fila) {
        return;
    }


    const valorInput =
        fila.querySelector(
            ".campo-valor"
        );


    const resultado =
        fila.querySelector(
            ".resultado"
        );


    const limiteCelda =
        fila.querySelector(
            ".limite"
        );


    if (
        !valorInput ||
        !resultado ||
        !limiteCelda
    ) {

        return;

    }


    const valor =
        parseFloat(
            valorInput.value
        );


    const limite =
        parseFloat(
            limiteCelda.textContent
        );


    if (
        isNaN(valor) ||
        isNaN(limite)
    ) {

        resultado.textContent =
            "—";

        resultado.className =
            "resultado";

        return;

    }


    if (
        valor <= limite
    ) {

        resultado.textContent =
            "CUMPLE";

        resultado.className =
            "resultado cumple";

    }
    else {

        resultado.textContent =
            "NO CUMPLE";

        resultado.className =
            "resultado no-cumple";

    }

}


/* =========================================================
   LÍMITE EXTERIOR
   ========================================================= */

function actualizarLimiteExterior(elemento) {

    const fila =
        elemento.closest("tr");


    if (!fila) {
        return;
    }


    const periodo =
        fila.querySelector(
            ".campo-periodo"
        )?.value || "";


    const limiteCelda =
        fila.querySelector(
            ".limite"
        );


    let limiteBase = null;


    if (
        periodo === "Día" ||
        periodo === "Vespertino"
    ) {

        limiteBase = 55;

    }


    if (
        periodo === "Nocturno"
    ) {

        limiteBase = 45;

    }


    if (
        limiteBase === null
    ) {

        limiteCelda.textContent =
            "—";

    }
    else {

        const limiteEfectivo =
            limiteBase + 5;

        limiteCelda.textContent =
            limiteEfectivo + " dB";

    }


    actualizarResultadoExterior(fila);

    actualizarResumenDemo();

}


/* =========================================================
   RESULTADO EXTERIOR
   ========================================================= */

function actualizarResultadoExterior(fila) {

    if (!fila) {
        return;
    }


    const valorInput =
        fila.querySelector(
            ".campo-valor"
        );


    const resultado =
        fila.querySelector(
            ".resultado"
        );


    const limiteCelda =
        fila.querySelector(
            ".limite"
        );


    if (
        !valorInput ||
        !resultado ||
        !limiteCelda
    ) {

        return;

    }


    const valor =
        parseFloat(
            valorInput.value
        );


    const limite =
        parseFloat(
            limiteCelda.textContent
        );


    if (
        isNaN(valor) ||
        isNaN(limite)
    ) {

        resultado.textContent =
            "—";

        resultado.className =
            "resultado";

        return;

    }


    if (
        valor <= limite
    ) {

        resultado.textContent =
            "CUMPLE";

        resultado.className =
            "resultado cumple";

    }
    else {

        resultado.textContent =
            "NO CUMPLE";

        resultado.className =
            "resultado no-cumple";

    }

}


/* =========================================================
   ELIMINAR MEDICIÓN
   ========================================================= */

function eliminarMedida(boton) {

    if (!boton) {
        return;
    }


    const fila =
        boton.closest("tr");


    if (fila) {

        fila.remove();

    }


    actualizarResumenDemo();

}


/* =========================================================
   RESUMEN AUTOMÁTICO
   ========================================================= */

function actualizarResumenDemo() {

    const filasInterior =
        Array.from(
            document.querySelectorAll(
                "#tablaInterior tbody tr"
            )
        );


    const filasExterior =
        Array.from(
            document.querySelectorAll(
                "#tablaExterior tbody tr"
            )
        );


    const filas =
        [
            ...filasInterior,
            ...filasExterior
        ];


    let total = 0;

    let cumplen = 0;

    let noCumplen = 0;


    filas.forEach(
        fila => {

            const valor =
                parseFloat(
                    fila.querySelector(
                        ".campo-valor"
                    )?.value
                );


            const limite =
                parseFloat(
                    fila.querySelector(
                        ".limite"
                    )?.textContent
                );


            if (
                isNaN(valor) ||
                isNaN(limite)
            ) {

                return;

            }


            total++;


            if (
                valor <= limite
            ) {

                cumplen++;

            }
            else {

                noCumplen++;

            }

        }
    );


    const totalElemento =
        document.getElementById(
            "totalMedidas"
        );


    const cumplenElemento =
        document.getElementById(
            "totalCumplen"
        );


    const noCumplenElemento =
        document.getElementById(
            "totalNoCumplen"
        );


    if (totalElemento) {

        totalElemento.textContent =
            total;

    }


    if (cumplenElemento) {

        cumplenElemento.textContent =
            cumplen;

    }


    if (noCumplenElemento) {

        noCumplenElemento.textContent =
            noCumplen;

    }


    const resultadoGlobal =
        document.getElementById(
            "resultadoGlobal"
        );


    if (!resultadoGlobal) {
        return;
    }


    if (total === 0) {

        resultadoGlobal.textContent =
            "Introduce al menos una medición completa.";

        resultadoGlobal.className =
            "resultado-global pendiente";

        return;

    }


    if (noCumplen > 0) {

        resultadoGlobal.textContent =
            "NO CUMPLE";

        resultadoGlobal.className =
            "resultado-global no-cumple";

    }
    else {

        resultadoGlobal.textContent =
            "CUMPLE";

        resultadoGlobal.className =
            "resultado-global cumple";

    }

}


/* =========================================================
   RECOGER MEDICIONES INTERIORES
   ========================================================= */

function obtenerMedicionesInteriorDemo() {

    const filas =
        Array.from(
            document.querySelectorAll(
                "#tablaInterior tbody tr"
            )
        );


    return filas
        .map(
            fila => {

                const instalacion =
                    fila.querySelector(
                        ".campo-instalacion"
                    )?.value.trim() || "";


                const vivienda =
                    fila.querySelector(
                        ".campo-vivienda"
                    )?.value.trim() || "";


                const estancia =
                    fila.querySelector(
                        ".campo-estancia"
                    )?.value || "";


                const periodo =
                    fila.querySelector(
                        ".campo-periodo"
                    )?.value || "";


                const valorMedido =
                    fila.querySelector(
                        ".campo-valor"
                    )?.value || "";


                return {

                    instalacion:
                        instalacion,

                    vivienda:
                        vivienda,

                    estancia:
                        estancia,

                    periodo:
                        periodo,

                    valorMedido:
                        valorMedido

                };

            }
        )
        .filter(
            medida =>
                medida.valorMedido !== ""
        );

}


/* =========================================================
   RECOGER MEDICIONES EXTERIORES
   ========================================================= */

function obtenerMedicionesExteriorDemo() {

    const filas =
        Array.from(
            document.querySelectorAll(
                "#tablaExterior tbody tr"
            )
        );


    return filas
        .map(
            fila => {

                const instalacion =
                    fila.querySelector(
                        ".campo-instalacion"
                    )?.value.trim() || "";


                const vivienda =
                    fila.querySelector(
                        ".campo-vivienda"
                    )?.value.trim() || "";


                const zonaExterior =
                    fila.querySelector(
                        ".campo-zona"
                    )?.value.trim() || "";


                const periodo =
                    fila.querySelector(
                        ".campo-periodo"
                    )?.value || "";


                const valorMedido =
                    fila.querySelector(
                        ".campo-valor"
                    )?.value || "";


                return {

                    instalacion:
                        instalacion,

                    vivienda:
                        vivienda,

                    zonaExterior:
                        zonaExterior,

                    periodo:
                        periodo,

                    valorMedido:
                        valorMedido

                };

            }
        )
        .filter(
            medida =>
                medida.valorMedido !== ""
        );

}


/* =========================================================
   CREAR EXPEDIENTE PARA EL GENERADOR ORIGINAL
   ========================================================= */

function prepararExpedienteDemoOnline() {

    const obra =
        document.getElementById(
            "obra"
        )?.value.trim() || "";


    const expediente =
        document.getElementById(
            "expediente"
        )?.value.trim() || "";


    const peticionario =
        document.getElementById(
            "peticionario"
        )?.value.trim() || "";


    const localizacion =
        document.getElementById(
            "localizacion"
        )?.value.trim() || "";


    const nombre =
        document.getElementById(
            "nombre"
        )?.value.trim() || "";


    const fecha =
        document.querySelector(
            "#fechas input[type='date']"
        )?.value || "";


    const medidasInterior =
        obtenerMedicionesInteriorDemo();


    const medidasExterior =
        obtenerMedicionesExteriorDemo();


    if (!obra) {

        alert(
            "Introduce la obra."
        );

        return false;

    }


    if (!expediente) {

        alert(
            "Introduce el número de expediente."
        );

        return false;

    }


    if (!peticionario) {

        alert(
            "Introduce el peticionario."
        );

        return false;

    }


    if (!localizacion) {

        alert(
            "Introduce la localización."
        );

        return false;

    }


    if (
        medidasInterior.length === 0 &&
        medidasExterior.length === 0
    ) {

        alert(
            "Introduce al menos una medición."
        );

        return false;

    }


    const datosExpediente = {

        obra:
            obra,

        tipo:
            "vivienda",

        expediente:
            expediente,

        peticionario:
            peticionario,

        localizacion:
            localizacion,

        fechas:
            fecha
                ? [fecha]
                : [],

        creadoPor:
            nombre,

        estado:
            "En curso",

        medidasInterior:
            medidasInterior,

        medidasExterior:
            medidasExterior,

        imagenPortada:
            null,

        imagenLocalizacion:
            null

    };


    let expedientes =
        JSON.parse(
            localStorage.getItem(
                "expedientes"
            )
        ) || [];


    const indice =
        expedientes.findIndex(
            item =>
                String(item.expediente) ===
                String(expediente)
        );


    if (
        indice >= 0
    ) {

        expedientes[indice] =
            datosExpediente;

    }
    else {

        expedientes.push(
            datosExpediente
        );

    }


    localStorage.setItem(
        "expedientes",
        JSON.stringify(
            expedientes
        )
    );


    localStorage.setItem(
        "expedienteActual",
        expediente
    );


    localStorage.setItem(
        "expedienteCargado",
        JSON.stringify(
            datosExpediente
        )
    );


    /*
     * También dejamos el nombre disponible
     * para el código original.
     */

    localStorage.setItem(
        "nombreUsuario",
        nombre
    );


    console.log(
        "[DEMO] Expediente preparado:",
        datosExpediente
    );


    return true;

}


/* =========================================================
   PUENTE ENTRE EL FORMULARIO NUEVO Y GENERAR INFORME()
   ========================================================= */

async function adaptarFormularioYGenerar() {

    console.log(
        "========================================"
    );

    console.log(
        "[DEMO] GENERAR INFORME"
    );

    console.log(
        "========================================"
    );


    actualizarResumenDemo();


    const preparado =
        prepararExpedienteDemoOnline();


    if (!preparado) {

        return;

    }


    /*
     * Comprobamos que la función original
     * siga disponible.
     */

    if (
        typeof generarInforme !==
        "function"
    ) {

        console.error(
            "[DEMO] La función generarInforme() no está disponible."
        );


        alert(
            "No se encuentra la función original de generación del informe."
        );


        return;

    }


    try {

        await generarInforme();

    }
    catch (error) {

        console.error(
            "[DEMO] Error generando el informe:",
            error
        );


        if (
            typeof mostrarErrorGeneracionPDF ===
            "function"
        ) {

            mostrarErrorGeneracionPDF(
                error
            );

        }
        else {

            alert(
                "Se ha producido un error al generar el informe."
            );

        }

    }

}


/* =========================================================
   ACTUALIZAR RESULTADOS CUANDO SE MODIFICA EL FORMULARIO
   ========================================================= */

document.addEventListener(
    "input",
    function (evento) {

        if (
            evento.target.matches(
                ".campo-valor"
            )
        ) {

            actualizarResumenDemo();

        }

    }
);


document.addEventListener(
    "change",
    function (evento) {

        if (
            evento.target.matches(
                ".campo-estancia"
            )
        ) {

            actualizarLimiteInterior(
                evento.target
            );

        }


        if (
            evento.target.matches(
                ".campo-periodo"
            )
        ) {

            const fila =
                evento.target.closest(
                    "tr"
                );


            if (
                fila &&
                fila.closest(
                    "#tablaInterior"
                )
            ) {

                actualizarLimiteInterior(
                    evento.target
                );

            }


            if (
                fila &&
                fila.closest(
                    "#tablaExterior"
                )
            ) {

                actualizarLimiteExterior(
                    evento.target
                );

            }

        }


        actualizarResumenDemo();

    }
);


/* =========================================================
   FIN ADAPTACIÓN DEMO ONLINE
   ========================================================= */
