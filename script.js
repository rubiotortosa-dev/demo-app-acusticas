function abrirExpediente(numeroExpediente) {

    const expedientes = JSON.parse(
        localStorage.getItem("expedientes")
    ) || [];


    const expediente = expedientes.find(
        item =>
            item.expediente === numeroExpediente
    );


    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        return;
    }


    // Guardar expediente seleccionado

    localStorage.setItem(
        "expedienteActual",
        expediente.expediente
    );


    // Guardar copia del expediente cargado

    localStorage.setItem(
        "expedienteCargado",
        JSON.stringify(expediente)
    );


    // Abrir sus datos

    mostrarDatos(
        expediente
    );

}


function actualizarLimiteExterior(elemento) {

    const fila = elemento.closest("tr");

    const periodo = elemento.value;

    const limiteCelda = fila.querySelector(".limite");

    let limite = null;

    if (periodo === "Día" || periodo === "Vespertino") {
        limite = "55 (+5) dB";
    }

    if (periodo === "Nocturno") {
        limite = "45 (+5) dB";
    }

    if (limite !== null) {
        limiteCelda.textContent = limite;
    } else {
        limiteCelda.textContent = "—";
    }

    actualizarResultadoExterior(fila);
}


function actualizarLimiteInterior(elemento) {

    const fila = elemento.closest("tr");

    const estancia = fila.querySelector("select").value;

    const selects = fila.querySelectorAll("select");

    const periodo = selects[1].value;

    const limiteCelda = fila.querySelector(".limite");

    let limite = null;

    if (estancia === "salon" || estancia === "oficina") {

        if (periodo === "Día" || periodo === "Vespertino") {
            limite = 45;
        }

        if (periodo === "Nocturno") {
            limite = 35;
        }

    }

    if (estancia === "dormitorio") {

        if (periodo === "Día" || periodo === "Vespertino") {
            limite = 40;
        }

        if (periodo === "Nocturno") {
            limite = 30;
        }

    }

    if (limite !== null) {
        limiteCelda.textContent = limite + " dB";
    } else {
        limiteCelda.textContent = "—";
    }

    actualizarResultado(fila);
}


function actualizarResultado(fila) {

    const valorInput = fila.querySelector(
        'input[type="number"]'
    );

    const valor = parseFloat(valorInput.value);

    const limiteTexto = fila.querySelector(".limite").textContent;

    const limite = parseFloat(limiteTexto);

    const resultado = fila.querySelector(".resultado");

    if (isNaN(valor) || isNaN(limite)) {
        resultado.textContent = "—";
        return;
    }

    if (valor <= limite) {
        resultado.textContent = "Cumple";
    } else {
        resultado.textContent = "No Cumple";
    }
}


function actualizarResultadoExterior(fila) {

    const valorInput = fila.querySelector(
        'input[type="number"]'
    );

    const valor = parseFloat(valorInput.value);

    const limiteTexto = fila.querySelector(".limite").textContent;

    const coincidencia = limiteTexto.match(/\d+/);

    if (!coincidencia || isNaN(valor)) {
        fila.querySelector(".resultado").textContent = "—";
        return;
    }

    const limiteBase = parseFloat(coincidencia[0]);

    const incremento = 5;

    const limiteEfectivo = limiteBase + incremento;

    if (valor <= limiteEfectivo) {
        fila.querySelector(".resultado").textContent = "Cumple";
    } else {
        fila.querySelector(".resultado").textContent = "No Cumple";
    }
}


function anadirFecha() {

    const contenedor = document.getElementById("fechas");

    const nuevaFecha = document.createElement("div");

    nuevaFecha.className = "fecha";

    nuevaFecha.innerHTML = `
        <input type="date">
        <button
            type="button"
            class="eliminar-fecha"
            onclick="this.parentElement.remove()"
        >
            ×
        </button>
    `;

    contenedor.appendChild(nuevaFecha);
}


function anadirMedidaExterior() {

    const tabla = document.querySelector("#tablaExterior tbody");

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>
            <input
                type="text"
                placeholder="Instalación"
            >
        </td>

        <td>
            <input
                type="text"
                placeholder="Vivienda"
            >
        </td>

        <td>
            <input
                type="text"
                placeholder="Zona exterior"
            >
        </td>

        <td>
            <select onchange="actualizarLimiteExterior(this)">
                <option value="">Seleccionar</option>
                <option value="Día">Día</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Nocturno">Nocturno</option>
            </select>
        </td>

        <td>
            <input
                type="number"
                step="0.1"
                placeholder="dB"
                oninput="actualizarResultadoExterior(this.closest('tr'))"
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
                onclick="eliminarMedida(this)"
                title="Eliminar medida"
            >
                ×
            </button>
        </td>
    `;

    tabla.appendChild(fila);
}


function anadirMedidaInterior() {

    const tabla = document.querySelector("#tablaInterior tbody");

    if (!tabla) {
        console.error("No se ha encontrado la tabla interior.");
        return;
    }

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>
            <input
                type="text"
                placeholder="Instalación"
            >
        </td>

        <td>
            <input
                type="text"
                placeholder="Vivienda"
            >
        </td>

        <td>
            <select
                onchange="actualizarLimiteInterior(this)"
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
                onchange="actualizarLimiteInterior(this)"
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
                placeholder="dB"
                oninput="actualizarResultado(this.closest('tr'))"
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
                onclick="eliminarMedida(this)"
                title="Eliminar medida"
            >
                ×
            </button>
        </td>
    `;

    tabla.appendChild(fila);
}


function anteriorDesdeImagenes() {

    const numeroExpediente =
        localStorage.getItem(
            "expedienteActual"
        );


    const expedientes =
        JSON.parse(
            localStorage.getItem(
                "expedientes"
            )
        ) || [];


    const expediente =
        expedientes.find(
            item =>
                item.expediente ===
                numeroExpediente
        );


    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        return;
    }


    mostrarMedidas(
        expediente
    );

}


function anteriorDesdeMedidas() {

    const numeroExpediente =
        localStorage.getItem(
            "expedienteActual"
        );


    const expedientes =
        JSON.parse(
            localStorage.getItem(
                "expedientes"
            )
        ) || [];


    const expediente =
        expedientes.find(
            item =>
                item.expediente ===
                numeroExpediente
        );


    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        return;
    }


    mostrarDatos(
        expediente
    );

}


function cargarExpedientes() {

    const contenedor =
        document.getElementById("listaExpedientes");

    if (!contenedor) {
        return;
    }


    // =====================================================
    // RECUPERAR EXPEDIENTES GUARDADOS
    // =====================================================

    let expedientes =
        JSON.parse(
            localStorage.getItem("expedientes")
        ) || [];


    // =====================================================
    // EXPEDIENTE DE DEMOSTRACIÓN
    // =====================================================

    const existeDemo =
        expedientes.some(
            expediente =>
                String(expediente.expediente) ===
                "O/0000001"
        );


    // Si no existe, lo creamos automáticamente

    if (!existeDemo) {

        const expedienteDemo = {

            obra:
                "Prueba 1",

            tipo:
                "vivienda",

            expediente:
                "O/0000001",

            peticionario:
                "Antonio Tortosa",

            localizacion:
                "C/ Infante",

            fechas:
                ["2026-08-21"],

            creadoPor:
                "Antonio Tortosa",

            estado:
                "En curso",

            medidasInterior: [

                {
                    instalacion:
                        "Bajante de Saneamiento",

                    vivienda:
                        "1ºA",

                    estancia:
                        "dormitorio",

                    periodo:
                        "Nocturno",

                    valorMedido:
                        "36"
                },

                {
                    instalacion:
                        "Ventilación Forzada de Garaje (30 Hz)",

                    vivienda:
                        "1ºB",

                    estancia:
                        "salon",

                    periodo:
                        "Nocturno",

                    valorMedido:
                        "30"
                }

            ],

            medidasExterior: [

                {
                    instalacion:
                        "Ventilación Forzada de Garaje (30 Hz)",

                    vivienda:
                        "4ºB",

                    zonaExterior:
                        "Terraza",

                    periodo:
                        "Nocturno",

                    valorMedido:
                        "45"
                }

            ],

            imagenPortada:
                null,

            imagenLocalizacion:
                null
        };


        // Añadir el expediente de demostración

        expedientes.unshift(
            expedienteDemo
        );


        // Guardarlo en localStorage

        localStorage.setItem(
            "expedientes",
            JSON.stringify(expedientes)
        );

    }


    // =====================================================
    // COMPROBAR SI HAY EXPEDIENTES
    // =====================================================

    if (expedientes.length === 0) {

        contenedor.innerHTML = `
            <p class="sin-expedientes">
                No hay expedientes creados todavía.
            </p>
        `;

        return;
    }


    // =====================================================
    // LIMPIAR LISTA
    // =====================================================

    contenedor.innerHTML = "";


    // =====================================================
    // MOSTRAR LOS EXPEDIENTES
    // =====================================================

    expedientes.forEach(
        expediente => {

            const elemento =
                document.createElement("div");


            elemento.className =
                "expediente";


            elemento.innerHTML = `

                <div>

                    <strong>
                        ${expediente.expediente}
                    </strong>

                    <span>
                        ${expediente.obra}
                    </span>

                    <small>
                        Creado por:
                        ${expediente.creadoPor || "No indicado"}
                    </small>

                </div>


                <div class="acciones-expediente">

                    <span class="estado curso">
                        ${expediente.estado || "En curso"}
                    </span>


                    <button
                        type="button"
                        class="boton-abrir"
                        onclick="abrirExpediente('${expediente.expediente}')"
                    >
                        ABRIR
                    </button>


                    <button
                        type="button"
                        class="boton-eliminar-expediente"
                        onclick="eliminarExpediente('${expediente.expediente}')"
                        title="Eliminar expediente"
                    >
                        🗑
                    </button>

                </div>

            `;


            contenedor.appendChild(
                elemento
            );

        }
    );

}


function continuar() {

    const nombre = document.getElementById("nombre").value.trim();

    if (nombre === "") {
        alert("Por favor, introduce tu nombre.");
        return;
    }

    localStorage.setItem("nombreUsuario", nombre);

    mostrarInicio(nombre);
}


function convertirDataURLaBlob(dataURL) {

    if (
        !dataURL ||
        typeof dataURL !== "string"
    ) {
        return null;
    }

    const partes =
        dataURL.split(",");

    if (
        partes.length !== 2
    ) {
        return null;
    }

    const encabezado =
        partes[0];

    const datos =
        partes[1];

    const mimeMatch =
        encabezado.match(
            /data:(.*?);base64/
        );

    const mime =
        mimeMatch
            ? mimeMatch[1]
            : "application/octet-stream";

    const binario =
        atob(datos);

    const longitud =
        binario.length;

    const bytes =
        new Uint8Array(longitud);

    for (
        let i = 0;
        i < longitud;
        i++
    ) {
        bytes[i] =
            binario.charCodeAt(i);
    }

    return new Blob(
        [bytes],
        {
            type: mime
        }
    );
}


function crearArchivoTexto(nombre, contenido) {

    return {
        nombre: nombre,
        contenido: contenido
    };

}


function eliminarExpediente(numeroExpediente) {

    const confirmar = confirm(
        "¿Estás seguro de que quieres eliminar este expediente?\n\n" +
        "Esta acción no se puede deshacer."
    );

    if (!confirmar) {
        return;
    }


    // Recuperar expedientes guardados

    let expedientes = JSON.parse(
        localStorage.getItem("expedientes")
    ) || [];


    // Guardar el número de expedientes antes de borrar

    const cantidadAntes = expedientes.length;


    // Eliminar el expediente seleccionado

    expedientes = expedientes.filter(
        expediente =>
            String(expediente.expediente) !==
            String(numeroExpediente)
    );


    // Comprobar que realmente se ha eliminado

    if (expedientes.length === cantidadAntes) {

        alert(
            "No se ha encontrado el expediente que quieres eliminar."
        );

        return;
    }


    // Guardar nuevamente la lista

    localStorage.setItem(
        "expedientes",
        JSON.stringify(expedientes)
    );


    // Si el expediente eliminado era el que estaba abierto,
    // eliminamos también la referencia al expediente actual.

    const expedienteActual =
        localStorage.getItem("expedienteActual");


    if (
        String(expedienteActual) ===
        String(numeroExpediente)
    ) {

        localStorage.removeItem(
            "expedienteActual"
        );

        localStorage.removeItem(
            "expedienteCargado"
        );

    }


    // Actualizar la lista de Inicio

    cargarExpedientes();

}


function eliminarMedida(boton) {

    const fila = boton.closest("tr");

    fila.remove();
}


function escaparLatex(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/_/g, "\\_")
        .replace(/{/g, "\\{")
        .replace(/}/g, "\\}")
        .replace(/~/g, "\\textasciitilde{}")
        .replace(/\^/g, "\\textasciicircum{}");
}


function generarDatosTex(datos) {

    let tex = "";


    // =========================================================
    // OBRA
    // =========================================================

    tex +=
        `\\newcommand{\\Obra}{${escaparLatex(
            datos.Obra || ""
        )}}\n\n`;


    // =========================================================
    // VIVIENDA / VIVIENDAS
    // =========================================================

    tex +=
        `\\newcommand{\\viviendasestudio}{${escaparLatex(
            datos.viviendasestudio || ""
        )}}\n\n`;


    // =========================================================
    // NÚMERO DE EXPEDIENTE
    // =========================================================

    tex +=
        `\\newcommand{\\Nexpediente}{${escaparLatex(
            datos.Nexpediente || ""
        )}}\n\n`;


    // =========================================================
    // PETICIONARIO
    // =========================================================

    tex +=
        `\\newcommand{\\Peticionario}{${escaparLatex(
            datos.Peticionario || ""
        )}}\n\n`;


    // =========================================================
    // LOCALIZACIÓN
    // =========================================================

    tex +=
        `\\newcommand{\\localizacion}{${escaparLatex(
            datos.localizacion || ""
        )}}\n\n`;


    // =========================================================
    // FECHA DE VISITA
    // =========================================================

    let fechaVisita = "";


    if (datos.fechasvisita) {

        fechaVisita =
            datos.fechasvisita;

    }


    tex +=
        `\\newcommand{\\fechasvisita}{${escaparLatex(
            fechaVisita
        )}}\n\n`;


    // =========================================================
    // DATOS DE LAS MÁQUINAS
    // =========================================================

    tex +=
        "\\newcommand{\\DatosMaquinas}{\n";


    // ---------------------------------------------------------
    // MEDICIONES INTERIORES
    // ---------------------------------------------------------

    if (
        Array.isArray(
            datos.medidasInterior
        )
    ) {

        datos.medidasInterior.forEach(
            medida => {

                const instalacion =
                    escaparLatex(
                        medida.instalacion || ""
                    );


                const estancia =
                    escaparLatex(
                        ponerPrimeraMayuscula(
                            medida.estancia || ""
                        )
                    );


                if (
                    instalacion ||
                    estancia
                ) {

                    tex +=
                        `${instalacion} & ${estancia} \\\\ \\hline\n`;

                }

            }
        );

    }


    // ---------------------------------------------------------
    // MEDICIONES EXTERIORES
    // ---------------------------------------------------------

    if (
        Array.isArray(
            datos.medidasExterior
        )
    ) {

        datos.medidasExterior.forEach(
            medida => {

                const instalacion =
                    escaparLatex(
                        medida.instalacion || ""
                    );


                const zonaExterior =
                    escaparLatex(
                        ponerPrimeraMayuscula(
                            medida.zonaExterior || ""
                        )
                    );


                if (
                    instalacion ||
                    zonaExterior
                ) {

                    tex +=
                        `${instalacion} & ${zonaExterior} \\\\ \\hline\n`;

                }

            }
        );

    }


    tex +=
        "}\n";


    return tex;

}


async function generarInforme() {

    console.log("========================================");
    console.log("INICIANDO GENERACIÓN DEL INFORME");
    console.log("========================================");

    // =====================================================
    // EXPEDIENTE ACTUAL
    // =====================================================

    const numeroExpediente =
        localStorage.getItem("expedienteActual");

    if (!numeroExpediente) {

        alert(
            "No hay ningún expediente seleccionado."
        );

        return;
    }


    const expedientes =
        JSON.parse(
            localStorage.getItem("expedientes")
        ) || [];


    const expediente =
        expedientes.find(
            item =>
                String(item.expediente) ===
                String(numeroExpediente)
        );


    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        return;
    }


    console.log(
        "Expediente encontrado:",
        expediente
    );


    // =====================================================
    // MOSTRAR PROGRESO
    // =====================================================

    mostrarEstadoGeneracionPDF();

    actualizarProgresoInforme(
        5,
        "Preparando los datos del expediente..."
    );


    // =====================================================
    // DATOS
    // =====================================================

    const medidasInterior =
        Array.isArray(expediente.medidasInterior)
            ? expediente.medidasInterior
            : [];


    const medidasExterior =
        Array.isArray(expediente.medidasExterior)
            ? expediente.medidasExterior
            : [];


    // =====================================================
    // GENERAR ARCHIVOS TEX
    // =====================================================

    actualizarProgresoInforme(
        10,
        "Generando los datos del informe..."
    );


    let datosTex = "";
    let interioresTex = "";
    let exterioresTex = "";
    let resultadosTex = "";


    try {

        datosTex =
            generarDatosTex(
                expediente
            );


        actualizarProgresoInforme(
            15,
            "Generando mediciones interiores..."
        );


        interioresTex =
            generarMedicionesInterioresTex(
                medidasInterior
            );


        actualizarProgresoInforme(
            20,
            "Generando mediciones exteriores..."
        );


        exterioresTex =
            generarMedicionesExterioresTex(
                medidasExterior
            );


        actualizarProgresoInforme(
            25,
            "Generando tabla de resultados..."
        );


        resultadosTex =
            generarResultadosTex(
                medidasInterior,
                medidasExterior
            );

    }
    catch (error) {

        console.error(
            "Error generando archivos TEX:",
            error
        );


        mostrarErrorGeneracionPDF(
            error.message
        );


        return;
    }


    // =====================================================
    // CARGAR PLANTILLA
    // =====================================================

    actualizarProgresoInforme(
        30,
        "Cargando plantilla LaTeX..."
    );


    let zip;


    try {

        console.log(
            "Cargando plantilla LaTeX..."
        );


        const respuesta =
            await fetch(
                "plantilla/DEMO%20APP.zip"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se ha podido cargar la plantilla. " +
                "Código HTTP: " +
                respuesta.status
            );

        }


        const plantillaBlob =
            await respuesta.blob();


        actualizarProgresoInforme(
            35,
            "Preparando archivos de la plantilla..."
        );


        zip =
            await JSZip.loadAsync(
                plantillaBlob
            );


        console.log(
            "Plantilla cargada correctamente."
        );

    }
    catch (error) {

        console.error(
            "Error cargando plantilla:",
            error
        );


        mostrarErrorGeneracionPDF(
            error.message
        );


        return;
    }


    // =====================================================
    // SUSTITUIR ARCHIVOS TEX
    // =====================================================

    actualizarProgresoInforme(
        40,
        "Insertando los datos en la plantilla..."
    );


    zip.file(
        "00_Preambulo/03_Datos APP.tex",
        datosTex
    );


    zip.file(
        "00_Preambulo/04_Mediciones Interiores.tex",
        interioresTex
    );


    zip.file(
        "00_Preambulo/05_Mediciones Exteriores.tex",
        exterioresTex
    );


    zip.file(
        "00_Preambulo/06_Resultados APP.tex",
        resultadosTex
    );


    // =====================================================
    // PORTADA
    // =====================================================

    actualizarProgresoInforme(
        43,
        "Preparando imágenes del informe..."
    );


    if (
        expediente.imagenPortada
    ) {

        try {

            const portadaBlob =
                convertirDataURLaBlob(
                    expediente.imagenPortada
                );


            if (portadaBlob) {

                zip.file(
                    "figuras/Portada.jpeg",
                    portadaBlob
                );

            }

        }
        catch (error) {

            console.warn(
                "No se pudo sustituir Portada.jpeg:",
                error
            );

        }

    }


    // =====================================================
    // LOCALIZACIÓN
    // =====================================================

    if (
        expediente.imagenLocalizacion
    ) {

        try {

            const localizacionBlob =
                convertirDataURLaBlob(
                    expediente.imagenLocalizacion
                );


            if (localizacionBlob) {

                zip.file(
                    "figuras/localizacion.png",
                    localizacionBlob
                );

            }

        }
        catch (error) {

            console.warn(
                "No se pudo sustituir localizacion.png:",
                error
            );

        }

    }


    // =====================================================
    // BUSYTEX
    // =====================================================

    try {

        actualizarProgresoInforme(
            45,
            "Inicializando el motor LaTeX..."
        );


        console.log(
            "========================================"
        );

        console.log(
            "INICIANDO BUSYTÉX"
        );

        console.log(
            "========================================"
        );


        // -------------------------------------------------
        // CONFIGURACIÓN
        // -------------------------------------------------

        const basePath =
            "/demo-app-acusticas/core/busytex";


        const paquetes = [

            basePath +
            "/texlive-basic.js"

        ];


        const remoteEndpoint =
            "https://texlive2026.texlyre.org";


        console.log(
            "Base path:",
            basePath
        );


        console.log(
            "Paquetes locales:",
            paquetes
        );


        console.log(
            "TeX Live remoto:",
            remoteEndpoint
        );


        // -------------------------------------------------
        // CREAR RUNNER
        // -------------------------------------------------

        actualizarProgresoInforme(
            50,
            "Preparando BusyTeX..."
        );


        const runner =
            new BusyTexRunner({

                busytexBasePath:
                    basePath,

                engineMode:
                    "combined",

                preloadDataPackages:
                    paquetes,

                verbose:
                    true

            });


        console.log(
            "BusyTexRunner creado."
        );


        // -------------------------------------------------
        // INICIALIZAR
        // -------------------------------------------------

        actualizarProgresoInforme(
            52,
            "Inicializando BusyTeX y cargando paquetes..."
        );


        await runner.initialize();


        console.log(
            "BusyTeX inicializado correctamente."
        );


        actualizarProgresoInforme(
            55,
            "Motor LaTeX preparado."
        );


        // -------------------------------------------------
        // PDFLATEX
        // -------------------------------------------------

        const pdfLatex =
            new PdfLatex(
                runner
            );


        console.log(
            "PdfLatex preparado."
        );


        // -------------------------------------------------
        // EXTRAER ARCHIVOS DEL ZIP
        // -------------------------------------------------

        actualizarProgresoInforme(
            57,
            "Preparando archivos para la compilación..."
        );


        const archivos =
            {};


        const promesas =
            [];


        zip.forEach(
            (ruta, archivo) => {

                if (
                    archivo.dir
                ) {

                    return;

                }


                promesas.push(

                    archivo
                        .async("uint8array")
                        .then(
                            contenido => {

                                archivos[ruta] =
                                    contenido;

                            }
                        )

                );

            }
        );


        await Promise.all(
            promesas
        );


        console.log(
            "Archivos preparados:",
            Object.keys(archivos)
        );


        actualizarProgresoInforme(
            60,
            "Archivos preparados. Buscando documento principal..."
        );


        // =================================================
        // BUSCAR DOCUMENTO PRINCIPAL
        // =================================================

        let mainTexPath =
            null;


        // -------------------------------------------------
        // 1. BUSCAR main.tex
        // -------------------------------------------------

        for (
            const ruta
            of Object.keys(archivos)
        ) {

            if (
                ruta
                    .replace(/\\/g, "/")
                    .toLowerCase() ===
                "main.tex"
            ) {

                mainTexPath =
                    ruta;

                break;

            }

        }


        // -------------------------------------------------
        // 2. BUSCAR DEMO APP.tex
        // -------------------------------------------------

        if (
            !mainTexPath
        ) {

            for (
                const ruta
                of Object.keys(archivos)
            ) {

                const nombreArchivo =
                    ruta
                        .replace(/\\/g, "/")
                        .split("/")
                        .pop()
                        .toLowerCase();


                if (
                    nombreArchivo ===
                    "demo app.tex"
                ) {

                    mainTexPath =
                        ruta;

                    break;

                }

            }

        }


        // -------------------------------------------------
        // 3. BUSCAR CUALQUIER .tex
        // -------------------------------------------------

        if (
            !mainTexPath
        ) {

            for (
                const ruta
                of Object.keys(archivos)
            ) {

                if (
                    ruta
                        .toLowerCase()
                        .endsWith(".tex")
                ) {

                    mainTexPath =
                        ruta;

                    break;

                }

            }

        }


        // -------------------------------------------------
        // COMPROBAR
        // -------------------------------------------------

        if (
            !mainTexPath
        ) {

            throw new Error(
                "No se ha encontrado ningún archivo .tex principal en la plantilla."
            );

        }


        console.log(
            "========================================"
        );


        console.log(
            "DOCUMENTO PRINCIPAL ENCONTRADO:"
        );


        console.log(
            mainTexPath
        );


        console.log(
            "========================================"
        );


        actualizarProgresoInforme(
            62,
            "Documento principal encontrado. Preparando compilación..."
        );


        // -------------------------------------------------
        // CONSTRUIR LISTA DE ARCHIVOS
        // -------------------------------------------------

        const archivosProyecto =
            [];


        for (
            const [ruta, contenido]
            of Object.entries(archivos)
        ) {

            if (
                ruta === mainTexPath
            ) {

                continue;

            }


            archivosProyecto.push({

                path:
                    ruta,

                content:
                    contenido

            });

        }


        // -------------------------------------------------
        // LEER DOCUMENTO PRINCIPAL
        // -------------------------------------------------

        const mainTex =
            new TextDecoder(
                "utf-8"
            ).decode(
                archivos[mainTexPath]
            );


        console.log(
            "Documento principal preparado."
        );


        console.log(
            "Archivo:",
            mainTexPath
        );


        console.log(
            "Longitud:",
            mainTex.length
        );


        console.log(
            "Primeros caracteres:"
        );


        console.log(
            mainTex.substring(
                0,
                500
            )
        );


        // =================================================
        // COMPILAR
        // =================================================

        actualizarProgresoInforme(
            65,
            "Compilando documento LaTeX..."
        );


        console.log(
            "========================================"
        );


        console.log(
            "COMENZANDO COMPILACIÓN"
        );


        console.log(
            "========================================"
        );


        const resultado =
            await pdfLatex.compile({

                input:
                    mainTex,

                additionalFiles:
                    archivosProyecto,

                bibtex:
                    false,

                makeindex:
                    false,

                rerun:
                    true,

                verbose:
                    "debug",

                remoteEndpoint:
                    remoteEndpoint

            });


        // =================================================
        // RESULTADO
        // =================================================

        console.log(
            "========================================"
        );


        console.log(
            "RESULTADO BUSYTÉX"
        );


        console.log(
            "========================================"
        );


        console.log(
            resultado
        );


        // =================================================
        // COMPROBAR RESULTADO
        // =================================================

        if (
            !resultado
        ) {

            throw new Error(
                "BusyTeX no ha devuelto ningún resultado."
            );

        }


        if (
            !resultado.success
        ) {

            console.error(
                "LOG DE LATEX:",
                resultado.log
            );


            throw new Error(

                "La compilación de LaTeX ha fallado.\n\n" +

                (
                    resultado.log ||
                    "Sin información adicional."
                )

            );

        }


        if (
            !resultado.pdf
        ) {

            throw new Error(

                "La compilación terminó correctamente, " +
                "pero BusyTeX no ha devuelto el PDF."

            );

        }


        // =================================================
        // PDF GENERADO
        // =================================================

        actualizarProgresoInforme(
            90,
            "Compilación terminada. Generando PDF..."
        );


        const pdfBlob =
            new Blob(

                [
                    resultado.pdf
                ],

                {
                    type:
                        "application/pdf"
                }

            );


        console.log(
            "PDF generado correctamente."
        );


        console.log(
            "Tamaño:",
            pdfBlob.size,
            "bytes"
        );


        // =================================================
        // CREAR URL
        // =================================================

        actualizarProgresoInforme(
            95,
            "Preparando vista previa..."
        );


        const pdfURL =
            URL.createObjectURL(
                pdfBlob
            );


        // =================================================
        // TERMINADO
        // =================================================

        actualizarProgresoInforme(
            100,
            "Informe generado correctamente."
        );


        // Pequeña pausa para que el usuario vea el 100 %
        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    400
                )
        );


        // =================================================
        // MOSTRAR PDF
        // =================================================

        cerrarEstadoGeneracionPDF();


        mostrarPDFInforme(
            pdfURL,
            numeroExpediente
        );


        console.log(
            "========================================"
        );


        console.log(
            "PDF GENERADO CORRECTAMENTE"
        );


        console.log(
            "========================================"
        );

    }
    catch (error) {

        console.error(
            "ERROR COMPLETO:",
            error
        );


        mostrarErrorGeneracionPDF(
            error.message
        );

    }

}


function generarMedicionesExterioresTex(
    medidas
) {

    let tex = "";


    medidas.forEach(
        medida => {

            const instalacion =
                escaparLatex(
                    medida.instalacion || ""
                );


            const vivienda =
                escaparLatex(
                    medida.vivienda || ""
                );


            const zonaExterior =
                escaparLatex(
                    medida.zonaExterior || ""
                );


            const valorMedido =
                escaparLatex(
                    medida.valorMedido || ""
                );


            // =====================================================
            // SUBSUBSECTION
            // =====================================================

            tex +=
                `\\subsubsection{Vivienda ${vivienda} ${zonaExterior} ${instalacion}}\n\n`;


            // =====================================================
            // PUNTO DE MEDICIÓN
            // =====================================================

            tex += `

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PUNTO DE MEDICIÓN
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

La medición se ha realizado en la ubicación indicada en la siguiente tabla.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Instalación} & ${instalacion} \\\\ \\hline
\\textbf{Vivienda} & ${vivienda} \\\\ \\hline
\\textbf{Zona exterior} & ${zonaExterior} \\\\ \\hline
\\end{tabular}

\\end{table}

\\vspace{-1cm}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% RUIDO Y FONDO
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Registros de ruido y fondo}

Los registros tomados durante la prueba corresponden a las mediciones de ruido y fondo. Los registros utilizados para la obtención de los resultados se indican a continuación.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Ruido} &
\\textbf{Fondo}
\\\\ \\hline

Registros &
* &
*
\\\\ \\hline

Registro utilizado &
* &
*
\\\\ \\hline

LAtt (dB) &
* &
*
\\\\ \\hline

LCtt (dB) &
* &
*
\\\\ \\hline

LAitt (dB) &
* &
*
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-1cm}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% NIVELES CORREGIDOS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Niveles corregidos}

A continuación se presentan los niveles acústicos corregidos por ruido de fondo, obtenidos mediante sustracción energética y representativos de la contribución real de la fuente evaluada.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Valor (dB)}
\\\\ \\hline

LAtt Corregido &
*
\\\\ \\hline

LCtt Corregido &
*
\\\\ \\hline

LAitt Corregido &
*
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-1cm}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PENALIZACIONES
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Penalizaciones}

Las penalizaciones aplicadas para la evaluación acústica se presentan a continuación.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Valor} &
\\textbf{Penalización} &
\\textbf{Valor}
\\\\ \\hline

Lt & * & Kt & *
\\\\ \\hline

Li & * & Ki & *
\\\\ \\hline

Lf & * & Kf & *
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-0.5cm}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PENALIZACIÓN TOTAL
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Penalización total}

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Concepto} &
\\textbf{Valor}
\\\\ \\hline

Kt + Ki + Kf &
*
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-0.5cm}

La suma de las penalizaciones aplicables es de * dB.

\\vspace{-0.5cm}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% RESULTADO FINAL
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Resultado final}

Por tanto, el nivel de evaluación acústica resultante tras aplicar las correcciones por ruido de fondo y las correspondientes penalizaciones es:

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Valor (dB)}
\\\\ \\hline

LKeqT &
${valorMedido}
\\\\ \\hline

\\end{tabular}

\\end{table}

\\newpage

`;

        }

    );


    return tex;

}


function generarMedicionesInterioresTex(
    medidas
) {

    let tex = "";


    medidas.forEach(
        medida => {

            const instalacion =
                escaparLatex(
                    medida.instalacion || ""
                );


            const vivienda =
                escaparLatex(
                    medida.vivienda || ""
                );


            const estancia =
                escaparLatex(
                    ponerPrimeraMayuscula(
                        medida.estancia || ""
                    )
                );


            const valorMedido =
                escaparLatex(
                    medida.valorMedido || ""
                );


            // =====================================================
            // SUBSUBSECTION
            // =====================================================

            tex +=
                `\\subsubsection{Vivienda ${vivienda} ${estancia} ${instalacion}}\n\n`;


            // =====================================================
            // PUNTO DE MEDICIÓN
            // =====================================================

            tex += `

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PUNTO DE MEDICIÓN
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

La medición se ha realizado en la ubicación indicada en la siguiente tabla.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Instalación} & ${instalacion} \\\\ \\hline
\\textbf{Vivienda} & ${vivienda} \\\\ \\hline
\\textbf{Estancia} & ${estancia} \\\\ \\hline
\\end{tabular}

\\end{table}

\\vspace{-1cm}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% RUIDO Y FONDO
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Registros de ruido y fondo}

Los registros tomados durante la prueba corresponden a las mediciones de ruido y fondo. Los registros utilizados para la obtención de los resultados se indican a continuación.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Ruido} &
\\textbf{Fondo}
\\\\ \\hline

Registros &
* &
*
\\\\ \\hline

Registro utilizado &
* &
*
\\\\ \\hline

LAtt (dB) &
* &
*
\\\\ \\hline

LCtt (dB) &
* &
*
\\\\ \\hline

LAitt (dB) &
* &
*
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-1cm}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% NIVELES CORREGIDOS
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Niveles corregidos}

A continuación se presentan los niveles acústicos corregidos por ruido de fondo, obtenidos mediante sustracción energética y representativos de la contribución real de la fuente evaluada.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Valor (dB)}
\\\\ \\hline

LAtt Corregido &
*
\\\\ \\hline

LCtt Corregido &
*
\\\\ \\hline

LAitt Corregido &
*
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-1cm}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PENALIZACIONES
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Penalizaciones}

Las penalizaciones aplicadas para la evaluación acústica se presentan a continuación.

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Valor} &
\\textbf{Penalización} &
\\textbf{Valor}
\\\\ \\hline

Lt & * & Kt & *
\\\\ \\hline

Li & * & Ki & *
\\\\ \\hline

Lf & * & Kf & *
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-0.5cm}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% PENALIZACIÓN TOTAL
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Penalización total}

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Concepto} &
\\textbf{Valor}
\\\\ \\hline

Kt + Ki + Kf &
*
\\\\ \\hline

\\end{tabular}

\\end{table}

\\vspace{-0.5cm}

La suma de las penalizaciones aplicables es de * dB.

\\vspace{-0.5cm}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% RESULTADO FINAL
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\paragraph{Resultado final}

Por tanto, el nivel de evaluación acústica resultante tras aplicar las correcciones por ruido de fondo y las correspondientes penalizaciones es:

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.2}

\\begin{tabular}{|c|c|}
\\hline
\\textbf{Parámetro} &
\\textbf{Valor (dB)}
\\\\ \\hline

LKeqT &
${valorMedido}
\\\\ \\hline

\\end{tabular}

\\end{table}

\\newpage

`;

        }

    );


    return tex;

}


function generarResultadosTex(
    medidasInterior,
    medidasExterior
) {

    // =========================================================
    // FUNCIONES AUXILIARES LOCALES
    // =========================================================

    function obtenerLimiteResultado(medida) {

        if (!medida) {
            return "";
        }

        const valor =
            parseFloat(
                medida.valorMedido
            );

        if (isNaN(valor)) {
            return "";
        }


        // =====================================================
        // MEDIDAS INTERIORES
        // =====================================================

        if (
            Object.prototype.hasOwnProperty.call(
                medida,
                "estancia"
            )
        ) {

            const estancia =
                String(
                    medida.estancia || ""
                ).toLowerCase();


            const periodo =
                String(
                    medida.periodo || ""
                );


            // -------------------------------------------------
            // SALÓN / OFICINA
            // -------------------------------------------------

            if (
                estancia === "salon" ||
                estancia === "oficina"
            ) {

                if (
                    periodo === "Día" ||
                    periodo === "Vespertino"
                ) {

                    return "45 dB";

                }


                if (
                    periodo === "Nocturno"
                ) {

                    return "35 dB";

                }

            }


            // -------------------------------------------------
            // DORMITORIO
            // -------------------------------------------------

            if (
                estancia === "dormitorio"
            ) {

                if (
                    periodo === "Día" ||
                    periodo === "Vespertino"
                ) {

                    return "40 dB";

                }


                if (
                    periodo === "Nocturno"
                ) {

                    return "30 dB";

                }

            }

        }


        // =====================================================
        // MEDIDAS EXTERIORES
        // =====================================================

        if (
            Object.prototype.hasOwnProperty.call(
                medida,
                "zonaExterior"
            )
        ) {

            const periodo =
                String(
                    medida.periodo || ""
                );


            if (
                periodo === "Día" ||
                periodo === "Vespertino"
            ) {

                return "55 (+5) dB";

            }


            if (
                periodo === "Nocturno"
            ) {

                return "45 (+5) dB";

            }

        }


        return "";

    }


    // =========================================================
    // OBTENER RESULTADO
    // =========================================================

    function obtenerResultadoResultado(medida) {

        if (!medida) {
            return "";
        }


        const valor =
            parseFloat(
                medida.valorMedido
            );


        if (isNaN(valor)) {
            return "";
        }


        // =====================================================
        // MEDIDA INTERIOR
        // =====================================================

        if (
            Object.prototype.hasOwnProperty.call(
                medida,
                "estancia"
            )
        ) {

            const estancia =
                String(
                    medida.estancia || ""
                ).toLowerCase();


            const periodo =
                String(
                    medida.periodo || ""
                );


            let limite =
                null;


            // -------------------------------------------------
            // SALÓN / OFICINA
            // -------------------------------------------------

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


            // -------------------------------------------------
            // DORMITORIO
            // -------------------------------------------------

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


            if (
                limite === null
            ) {

                return "";

            }


            return valor <= limite
                ? "Cumple"
                : "No Cumple";

        }


        // =====================================================
        // MEDIDA EXTERIOR
        // =====================================================

        if (
            Object.prototype.hasOwnProperty.call(
                medida,
                "zonaExterior"
            )
        ) {

            const periodo =
                String(
                    medida.periodo || ""
                );


            let limiteBase =
                null;


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

                return "";

            }


            // El (+5) se considera para el resultado

            const limiteEfectivo =
                limiteBase + 5;


            return valor <= limiteEfectivo
                ? "Cumple"
                : "No Cumple";

        }


        return "";

    }


    // =========================================================
    // GENERACIÓN DEL TEX
    // =========================================================

    let tex = "";


    // =========================================================
    // MEDICIONES INTERIORES
    // =========================================================

    tex += `
\\begin{center}

\\begin{xltabular}{\\textwidth}{|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|}
\\hline

\\textbf{Instalación} &
\\textbf{Vivienda} &
\\textbf{Estancia} &
\\textbf{Periodo} &
\\textbf{Valor medido} &
\\textbf{Valor límite} &
\\textbf{Resultado}
\\\\ \\hline

`;


    if (
        Array.isArray(
            medidasInterior
        )
    ) {

        medidasInterior.forEach(
            medida => {

                const instalacion =
                    escaparLatex(
                        medida.instalacion || ""
                    );


                const vivienda =
                    escaparLatex(
                        medida.vivienda || ""
                    );


                const estancia =
                    escaparLatex(
                        ponerPrimeraMayuscula(
                            medida.estancia || ""
                        )
                    );


                const periodo =
                    escaparLatex(
                        medida.periodo || ""
                    );


                const valorMedido =
                    escaparLatex(
                        medida.valorMedido || ""
                    );


                const valorLimite =
                    escaparLatex(
                        obtenerLimiteResultado(
                            medida
                        )
                    );


                const resultado =
                    escaparLatex(
                        obtenerResultadoResultado(
                            medida
                        )
                    );


                tex += `
${instalacion} &
${vivienda} &
${estancia} &
${periodo} &
${valorMedido} &
${valorLimite} &
${resultado}
\\\\ \\hline

`;

            }
        );

    }


    tex += `
\\end{xltabular}

\\end{center}

`;


    // =========================================================
    // MEDICIONES EXTERIORES
    // =========================================================

    tex += `
\\begin{center}

\\begin{xltabular}{\\textwidth}{|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|
>{\\centering\\arraybackslash}X|}
\\hline

\\textbf{Instalación} &
\\textbf{Vivienda} &
\\textbf{Zona exterior} &
\\textbf{Periodo} &
\\textbf{Valor medido} &
\\textbf{Valor límite} &
\\textbf{Resultado}
\\\\ \\hline

`;


    if (
        Array.isArray(
            medidasExterior
        )
    ) {

        medidasExterior.forEach(
            medida => {

                const instalacion =
                    escaparLatex(
                        medida.instalacion || ""
                    );


                const vivienda =
                    escaparLatex(
                        medida.vivienda || ""
                    );


                const zonaExterior =
                    escaparLatex(
                        ponerPrimeraMayuscula(
                            medida.zonaExterior || ""
                        )
                    );


                const periodo =
                    escaparLatex(
                        medida.periodo || ""
                    );


                const valorMedido =
                    escaparLatex(
                        medida.valorMedido || ""
                    );


                const valorLimite =
                    escaparLatex(
                        obtenerLimiteResultado(
                            medida
                        )
                    );


                const resultado =
                    escaparLatex(
                        obtenerResultadoResultado(
                            medida
                        )
                    );


                tex += `
${instalacion} &
${vivienda} &
${zonaExterior} &
${periodo} &
${valorMedido} &
${valorLimite} &
${resultado}
\\\\ \\hline

`;

            }
        );

    }


    tex += `
\\end{xltabular}

\\end{center}

`;


    return tex;

}


function guardarDatos(mostrarAviso = true) {

    const obra =
        document.getElementById("obra").value.trim();

    const numeroExpediente =
        document.getElementById("expediente").value.trim();

    const peticionario =
        document.getElementById("peticionario").value.trim();

    const localizacion =
        document.getElementById("localizacion").value.trim();


    const tipoSeleccionado =
        document.querySelector(
            'input[name="tipo"]:checked'
        );


    const fechas =
        Array.from(
            document.querySelectorAll(
                '#fechas input[type="date"]'
            )
        )
        .map(input => input.value)
        .filter(fecha => fecha !== "");


    // =========================
    // COMPROBAR DATOS
    // =========================

    if (
        obra === "" ||
        numeroExpediente === "" ||
        peticionario === "" ||
        localizacion === "" ||
        !tipoSeleccionado ||
        fechas.length === 0
    ) {

        alert(
            "Por favor, completa todos los datos del informe."
        );

        return false;
    }


    // =========================
    // RECUPERAR EXPEDIENTES
    // =========================

    let expedientes =
        JSON.parse(
            localStorage.getItem("expedientes")
        ) || [];


    const indiceExistente =
        expedientes.findIndex(
            item =>
                item.expediente === numeroExpediente
        );


    // =========================
    // EXPEDIENTE EXISTENTE
    // =========================

    if (indiceExistente !== -1) {

        const expedienteExistente =
            expedientes[indiceExistente];


        expedienteExistente.obra =
            obra;

        expedienteExistente.tipo =
            tipoSeleccionado.value;

        expedienteExistente.expediente =
            numeroExpediente;

        expedienteExistente.peticionario =
            peticionario;

        expedienteExistente.localizacion =
            localizacion;

        expedienteExistente.fechas =
            fechas;


        // Mantener las medidas e imágenes existentes


        expedientes[indiceExistente] =
            expedienteExistente;

    }


    // =========================
    // EXPEDIENTE NUEVO
    // =========================

    else {

        const nuevoExpediente = {

            obra: obra,

            tipo:
                tipoSeleccionado.value,

            expediente:
                numeroExpediente,

            peticionario:
                peticionario,

            localizacion:
                localizacion,

            fechas:
                fechas,

            creadoPor:
                localStorage.getItem(
                    "nombreUsuario"
                ) || "",

            estado:
                "En curso",

            medidasInterior:
                [],

            medidasExterior:
                [],

            imagenPortada:
                null,

            imagenLocalizacion:
                null

        };


        expedientes.push(
            nuevoExpediente
        );

    }


    // =========================
    // GUARDAR
    // =========================

    localStorage.setItem(
        "expedientes",
        JSON.stringify(
            expedientes
        )
    );


    localStorage.setItem(
        "expedienteActual",
        numeroExpediente
    );


    // =========================
    // AVISO
    // =========================

    if (mostrarAviso) {

        alert(
            "Datos guardados correctamente."
        );
    }


    return true;
}


function guardarImagenes() {

    const inputPortada =
        document.getElementById(
            "imagenPortada"
        );

    const inputLocalizacion =
        document.getElementById(
            "imagenLocalizacion"
        );


    // =====================================
    // EXPEDIENTE ACTUAL
    // =====================================

    const numeroExpediente =
        localStorage.getItem(
            "expedienteActual"
        );


    if (!numeroExpediente) {

        alert(
            "No se ha encontrado el expediente actual."
        );

        return;
    }


    // =====================================
    // RECUPERAR EXPEDIENTES
    // =====================================

    let expedientes =
        JSON.parse(
            localStorage.getItem(
                "expedientes"
            )
        ) || [];


    const indice =
        expedientes.findIndex(
            expediente =>
                expediente.expediente ===
                numeroExpediente
        );


    if (indice === -1) {

        alert(
            "No se ha encontrado el expediente."
        );

        return;
    }


    // =====================================
    // FUNCIÓN PARA LEER ARCHIVOS
    // =====================================

    const leerArchivo = archivo => {

        return new Promise(
            (resolve, reject) => {

                if (!archivo) {

                    resolve(null);

                    return;
                }


                const lector =
                    new FileReader();


                lector.onload =
                    evento => {

                        resolve(
                            evento.target.result
                        );

                    };


                lector.onerror =
                    error => {

                        reject(error);

                    };


                lector.readAsDataURL(
                    archivo
                );

            }
        );

    };


    // =====================================
    // LEER LAS DOS IMÁGENES
    // =====================================

    Promise.all([

        leerArchivo(
            inputPortada.files[0]
        ),

        leerArchivo(
            inputLocalizacion.files[0]
        )

    ])
    .then(imagenes => {

        const portada =
            imagenes[0];

        const localizacion =
            imagenes[1];


        // Solo sustituimos una imagen
        // si el usuario ha seleccionado
        // una nueva.

        if (portada) {

            expedientes[indice]
                .imagenPortada =
                portada;

        }


        if (localizacion) {

            expedientes[indice]
                .imagenLocalizacion =
                localizacion;

        }


        // Guardar expediente

        localStorage.setItem(
            "expedientes",
            JSON.stringify(
                expedientes
            )
        );


        alert(
            "Imágenes guardadas correctamente."
        );

        mostrarInicio(
            localStorage.getItem("nombreUsuario")
        );

    })
    .catch(error => {

        console.error(
            "Error al guardar las imágenes:",
            error
        );

        alert(
            "Se ha producido un error al guardar las imágenes."
        );

    });

}


function guardarMedidas(mostrarAviso = true) {

    const filasInterior =
        document.querySelectorAll(
            "#tablaInterior tbody tr"
        );

    const filasExterior =
        document.querySelectorAll(
            "#tablaExterior tbody tr"
        );


    // =========================
    // INTERIORES
    // =========================

    const medidasInterior = [];


    filasInterior.forEach(fila => {

        const inputs =
            fila.querySelectorAll("input");

        const selects =
            fila.querySelectorAll("select");


        if (
            inputs.length < 3 ||
            selects.length < 2
        ) {
            return;
        }


        const medida = {

            instalacion:
                inputs[0].value.trim(),

            vivienda:
                inputs[1].value.trim(),

            estancia:
                selects[0].value,

            periodo:
                selects[1].value,

            valorMedido:
                inputs[2].value

        };


        // Ignorar filas completamente vacías

        if (
            medida.instalacion === "" &&
            medida.vivienda === "" &&
            medida.estancia === "" &&
            medida.periodo === "" &&
            medida.valorMedido === ""
        ) {
            return;
        }


        medidasInterior.push(
            medida
        );

    });


    // =========================
    // EXTERIORES
    // =========================

    const medidasExterior = [];


    filasExterior.forEach(fila => {

        const inputs =
            fila.querySelectorAll("input");

        const selects =
            fila.querySelectorAll("select");


        if (
            inputs.length < 4 ||
            selects.length < 1
        ) {
            return;
        }


        const medida = {

            instalacion:
                inputs[0].value.trim(),

            vivienda:
                inputs[1].value.trim(),

            zonaExterior:
                inputs[2].value.trim(),

            periodo:
                selects[0].value,

            valorMedido:
                inputs[3].value

        };


        // Ignorar filas completamente vacías

        if (
            medida.instalacion === "" &&
            medida.vivienda === "" &&
            medida.zonaExterior === "" &&
            medida.periodo === "" &&
            medida.valorMedido === ""
        ) {
            return;
        }


        medidasExterior.push(
            medida
        );

    });


    // =========================
    // EXPEDIENTE ACTUAL
    // =========================

    const numeroExpediente =
        localStorage.getItem(
            "expedienteActual"
        );


    if (!numeroExpediente) {

        alert(
            "No se ha encontrado el expediente actual."
        );

        return false;
    }


    // =========================
    // RECUPERAR EXPEDIENTES
    // =========================

    let expedientes =
        JSON.parse(
            localStorage.getItem(
                "expedientes"
            )
        ) || [];


    const indice =
        expedientes.findIndex(
            expediente =>
                expediente.expediente ===
                numeroExpediente
        );


    if (indice === -1) {

        alert(
            "No se ha encontrado el expediente."
        );

        return false;
    }


    // =========================
    // GUARDAR MEDIDAS
    // =========================

    expedientes[indice]
        .medidasInterior =
        medidasInterior;


    expedientes[indice]
        .medidasExterior =
        medidasExterior;


    // =========================
    // GUARDAR EN LOCALSTORAGE
    // =========================

    localStorage.setItem(
        "expedientes",
        JSON.stringify(
            expedientes
        )
    );


    // =========================
    // AVISO
    // =========================

    if (mostrarAviso) {

        alert(
            "Medidas guardadas correctamente."
        );
    }


    return true;
}


function mostrarCarga() {

    // =====================================
    // RECUPERAR EXPEDIENTE ACTUAL
    // =====================================

    const numeroExpediente =
        localStorage.getItem("expedienteActual");


    if (!numeroExpediente) {

        alert(
            "No se ha encontrado ningún expediente abierto."
        );

        volverInicio();

        return;
    }


    // =====================================
    // RECUPERAR EXPEDIENTES
    // =====================================

    const expedientes =
        JSON.parse(
            localStorage.getItem("expedientes")
        ) || [];


    // =====================================
    // BUSCAR EXPEDIENTE
    // =====================================

    const expediente =
        expedientes.find(
            item =>
                String(item.expediente) ===
                String(numeroExpediente)
        );


    // =====================================
    // COMPROBAR
    // =====================================

    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        volverInicio();

        return;
    }


    // =====================================
    // ASEGURAR EXPEDIENTE ACTUAL
    // =====================================

    localStorage.setItem(
        "expedienteActual",
        expediente.expediente
    );


    // =====================================
    // MOSTRAR PANTALLA DE CARGA
    // =====================================

    mostrarCargaPantalla(
        expediente
    );

}


function mostrarCargaPantalla(expediente) {

    const nombreUsuario =
        localStorage.getItem("nombreUsuario") || "";

    document.querySelector(".app").innerHTML = `

        <div class="pantalla-expediente">

            <!-- =========================
                 CABECERA
                 ========================= -->

            <header class="cabecera">

                <div>

                    <h1>ENGINEER TOOL</h1>

                    <p>
                        Preparación del informe
                        — ${expediente.expediente}
                    </p>

                </div>


                <div class="cabecera-derecha">

                    <div class="usuario">
                        ${nombreUsuario}
                    </div>


                    <button
                        type="button"
                        class="boton-inicio"
                        onclick="volverInicio()"
                    >
                        🏠 INICIO
                    </button>

                </div>

            </header>



            <main class="formulario-expediente pantalla-carga">


                <h2>
                    Preparar informe
                </h2>


                <p class="descripcion-pantalla">

                    El expediente está listo para preparar
                    el informe técnico.

                </p>



                <!-- =========================
                     ESTADO
                     ========================= -->

                <div class="carga-contenedor">

                    <div class="icono-carga">
                        📄
                    </div>


                    <h3>
                        Informe listo para generar
                    </h3>


                    <p>
                        Se utilizarán los datos,
                        mediciones e imágenes guardadas
                        en este expediente.
                    </p>


                    <div class="estado-carga">

                        <div class="estado-fila">

                            <span>
                                ✓ Datos del expediente
                            </span>

                            <span class="estado-ok">
                                Listos
                            </span>

                        </div>


                        <div class="estado-fila">

                            <span>
                                ✓ Medidas interiores
                            </span>

                            <span class="estado-ok">
                                ${
                                    (expediente.medidasInterior || []).length
                                }
                            </span>

                        </div>


                        <div class="estado-fila">

                            <span>
                                ✓ Medidas exteriores
                            </span>

                            <span class="estado-ok">
                                ${
                                    (expediente.medidasExterior || []).length
                                }
                            </span>

                        </div>


                        <div class="estado-fila">

                            <span>
                                ✓ Imagen de portada
                            </span>

                            <span class="estado-ok">
                                ${
                                    expediente.imagenPortada
                                        ? "Lista"
                                        : "No añadida"
                                }
                            </span>

                        </div>


                        <div class="estado-fila">

                            <span>
                                ✓ Imagen de localización
                            </span>

                            <span class="estado-ok">
                                ${
                                    expediente.imagenLocalizacion
                                        ? "Lista"
                                        : "No añadida"
                                }
                            </span>

                        </div>

                    </div>

                </div>



                <!-- =========================
                     BOTONES
                     ========================= -->

                <div class="acciones-navegacion">


                    <button
                        type="button"
                        class="boton-anterior"
                        onclick="volverAImagenes()"
                    >
                        ← ANTERIOR
                    </button>


                    <div class="navegacion-derecha">

                        <button
                            type="button"
                            class="boton-siguiente"
                            onclick="generarInforme()"
                        >
                            GENERAR INFORME →
                        </button>

                    </div>

                </div>


            </main>

        </div>

    `;
}


function mostrarDatos(expediente = null) {

    // Si no recibimos expediente, buscamos el expediente actual
    if (!expediente) {

        const numeroExpediente =
            localStorage.getItem("expedienteActual");

        const expedientes =
            JSON.parse(
                localStorage.getItem("expedientes")
            ) || [];

        expediente = expedientes.find(
            item => item.expediente === numeroExpediente
        );
    }


    const nombreUsuario =
        localStorage.getItem("nombreUsuario") || "";


    // Valores iniciales
    let obra = "";
    let tipo = "";
    let numeroExpediente = "";
    let peticionario = "";
    let localizacion = "";
    let fechas = [];


    // Si estamos editando un expediente existente
    if (expediente) {

        obra =
            expediente.obra || "";

        tipo =
            expediente.tipo || "";

        numeroExpediente =
            expediente.expediente || "";

        peticionario =
            expediente.peticionario || "";

        localizacion =
            expediente.localizacion || "";

        fechas =
            expediente.fechas || [];
    }


    document.querySelector(".app").innerHTML = `

        <div class="pantalla-expediente">


            <!-- =========================
                 CABECERA
                 ========================= -->

            <header class="cabecera">

                <div>

                    <h1>ENGINEER TOOL</h1>

                    <p>
                        ${expediente
                            ? "Editar expediente"
                            : "Nuevo expediente"}
                    </p>

                </div>


                <div class="cabecera-derecha">

                    <div class="usuario">
                        ${nombreUsuario}
                    </div>


                    <button
                        type="button"
                        class="boton-inicio"
                        onclick="volverInicio()"
                    >
                        🏠 INICIO
                    </button>

                </div>

            </header>



            <main class="formulario-expediente">


                <h2>Datos</h2>


                <!-- =========================
                     OBRA
                     ========================= -->

                <div class="campo">

                    <label>
                        Nombre de la obra / estudio
                    </label>

                    <input
                        type="text"
                        id="obra"
                        value="${obra}"
                        placeholder='Ej. 72 viviendas "Royal Palm" Estepona, Málaga'
                    >

                </div>



                <!-- =========================
                     TIPO
                     ========================= -->

                <div class="campo">

                    <label>
                        Tipo de estudio
                    </label>


                    <div class="opciones">

                        <label>

                            <input
                                type="radio"
                                name="tipo"
                                value="vivienda"
                                ${tipo === "vivienda"
                                    ? "checked"
                                    : ""}
                            >

                            Vivienda

                        </label>


                        <label>

                            <input
                                type="radio"
                                name="tipo"
                                value="viviendas"
                                ${tipo === "viviendas"
                                    ? "checked"
                                    : ""}
                            >

                            Varias viviendas

                        </label>

                    </div>

                </div>



                <!-- =========================
                     EXPEDIENTE
                     ========================= -->

                <div class="campo">

                    <label>
                        Nº de expediente
                    </label>

                    <input
                        type="text"
                        id="expediente"
                        value="${numeroExpediente}"
                        placeholder="Ej. O/2300004"
                    >

                </div>



                <!-- =========================
                     PETICIONARIO
                     ========================= -->

                <div class="campo">

                    <label>
                        Peticionario
                    </label>

                    <input
                        type="text"
                        id="peticionario"
                        value="${peticionario}"
                        placeholder="Ej. Juan Tilo"
                    >

                </div>



                <!-- =========================
                     LOCALIZACIÓN
                     ========================= -->

                <div class="campo">

                    <label>
                        Localización
                    </label>

                    <input
                        type="text"
                        id="localizacion"
                        value="${localizacion}"
                        placeholder="Ej. Calle Vivaldi, nº50, Marbella, Málaga"
                    >

                </div>



                <!-- =========================
                     FECHAS
                     ========================= -->

                <div class="campo">

                    <label>
                        Fecha de visita
                    </label>


                    <div id="fechas">

                        ${
                            fechas.length > 0

                            ?

                            fechas.map(fecha => `

                                <div class="fecha">

                                    <input
                                        type="date"
                                        value="${fecha}"
                                    >

                                </div>

                            `).join("")

                            :

                            `

                                <div class="fecha">

                                    <input
                                        type="date"
                                    >

                                </div>

                            `
                        }

                    </div>


                    <button
                        type="button"
                        class="boton-secundario"
                        onclick="anadirFecha()"
                    >
                        + Añadir otra fecha de visita
                    </button>

                </div>



                <!-- =========================
                     NAVEGACIÓN
                     ========================= -->

                <div class="acciones-navegacion">


                    <button
                        type="button"
                        class="boton-cancelar"
                        onclick="volverInicio()"
                    >
                        🏠 INICIO
                    </button>


                    <div class="navegacion-derecha">


                        <button
                            type="button"
                            class="boton-principal"
                            onclick="guardarDatos()"
                        >
                            GUARDAR
                        </button>


                        <button
                            type="button"
                            class="boton-siguiente"
                            onclick="siguienteDesdeDatos()"
                        >
                            SIGUIENTE →
                        </button>

                    </div>

                </div>


            </main>

        </div>

    `;
}


function mostrarEstadoGeneracionPDF() {

    // =====================================================
    // EVITAR DUPLICADOS
    // =====================================================

    const anterior =
        document.getElementById(
            "pantallaProgresoPDF"
        );

    if (anterior) {
        anterior.remove();
    }


    // =====================================================
    // DESHABILITAR BOTÓN
    // =====================================================

    const boton =
        document.querySelector(
            'button[onclick="generarInforme()"]'
        );


    if (boton) {

        boton.disabled =
            true;

        boton.textContent =
            "GENERANDO INFORME...";

    }


    // =====================================================
    // CREAR PANTALLA
    // =====================================================

    const pantalla =
        document.createElement(
            "div"
        );


    pantalla.id =
        "pantallaProgresoPDF";


    pantalla.innerHTML = `

        <div class="progreso-pdf-contenido">

            <div class="progreso-pdf-icono">
                ⚙️
            </div>

            <h2>
                Generando informe
            </h2>

            <p
                id="textoProgresoPDF"
                class="progreso-pdf-texto"
            >
                Preparando los datos del expediente...
            </p>


            <div class="progreso-pdf-barra">

                <div
                    id="barraProgresoPDF"
                    class="progreso-pdf-barra-interna"
                ></div>

            </div>


            <div
                id="porcentajeProgresoPDF"
                class="progreso-pdf-porcentaje"
            >
                5 %
            </div>


            <p class="progreso-pdf-aviso">
                No cierres esta ventana mientras se genera el informe.
            </p>

        </div>

    `;


    document.body.appendChild(
        pantalla
    );


    // =====================================================
    // ESTILOS
    // =====================================================

    if (
        !document.getElementById(
            "estilosProgresoPDF"
        )
    ) {

        const estilos =
            document.createElement(
                "style"
            );


        estilos.id =
            "estilosProgresoPDF";


        estilos.textContent = `

            #pantallaProgresoPDF {

                position: fixed;

                inset: 0;

                z-index: 99999;

                display: flex;

                align-items: center;

                justify-content: center;

                background:
                    rgba(0, 0, 0, 0.65);

                backdrop-filter:
                    blur(4px);

            }


            .progreso-pdf-contenido {

                width: min(
                    500px,
                    calc(100% - 40px)
                );

                padding: 40px;

                box-sizing: border-box;

                background: white;

                border-radius: 14px;

                text-align: center;

                box-shadow:
                    0 20px 60px
                    rgba(0, 0, 0, 0.30);

            }


            .progreso-pdf-icono {

                font-size: 42px;

                margin-bottom: 15px;

                animation:
                    girarProgresoPDF
                    1.5s linear infinite;

            }


            .progreso-pdf-contenido h2 {

                margin:
                    0 0 10px 0;

                font-size: 24px;

            }


            .progreso-pdf-texto {

                min-height: 24px;

                margin:
                    0 0 25px 0;

                color: #555;

                font-size: 15px;

            }


            .progreso-pdf-barra {

                width: 100%;

                height: 12px;

                overflow: hidden;

                border-radius: 20px;

                background: #e5e5e5;

            }


            .progreso-pdf-barra-interna {

                width: 5%;

                height: 100%;

                border-radius: 20px;

                background: #222;

                transition:
                    width 0.35s ease;

            }


            .progreso-pdf-porcentaje {

                margin-top: 12px;

                font-size: 18px;

                font-weight: bold;

            }


            .progreso-pdf-aviso {

                margin:
                    25px 0 0 0;

                font-size: 12px;

                color: #888;

            }


            @keyframes girarProgresoPDF {

                from {
                    transform:
                        rotate(0deg);
                }

                to {
                    transform:
                        rotate(360deg);
                }

            }

        `;


        document.head.appendChild(
            estilos
        );

    }

}


function actualizarProgresoInforme(
    porcentaje,
    mensaje
) {

    const barra =
        document.getElementById(
            "barraProgresoPDF"
        );


    const porcentajeTexto =
        document.getElementById(
            "porcentajeProgresoPDF"
        );


    const texto =
        document.getElementById(
            "textoProgresoPDF"
        );


    if (barra) {

        barra.style.width =
            porcentaje + "%";

    }


    if (porcentajeTexto) {

        porcentajeTexto.textContent =
            porcentaje + " %";

    }


    if (texto) {

        texto.textContent =
            mensaje;

    }


    console.log(
        `[PROGRESO] ${porcentaje}% - ${mensaje}`
    );

}


function cerrarEstadoGeneracionPDF() {

    const pantalla =
        document.getElementById(
            "pantallaProgresoPDF"
        );


    if (pantalla) {

        pantalla.remove();

    }


    const boton =
        document.querySelector(
            'button[onclick="generarInforme()"]'
        );


    if (boton) {

        boton.disabled =
            false;

        boton.textContent =
            "GENERAR INFORME →";

    }

}


function mostrarErrorGeneracionPDF(
    mensaje
) {

    // =====================================================
    // CERRAR PANTALLA DE PROGRESO
    // =====================================================

    cerrarEstadoGeneracionPDF();


    // =====================================================
    // MOSTRAR ERROR
    // =====================================================

    alert(
        "No se ha podido generar el PDF:\n\n" +
        mensaje
    );

}


function mostrarImagenes(expediente = null) {

    // =====================================
    // RECUPERAR EXPEDIENTE
    // =====================================

    if (!expediente) {

        const numeroExpediente =
            localStorage.getItem("expedienteActual");

        const expedientes =
            JSON.parse(
                localStorage.getItem("expedientes")
            ) || [];

        expediente = expedientes.find(
            item => item.expediente === numeroExpediente
        );
    }


    // =====================================
    // COMPROBAR EXPEDIENTE
    // =====================================

    if (!expediente) {

        alert("No se ha encontrado el expediente.");

        volverInicio();

        return;
    }


    localStorage.setItem(
        "expedienteActual",
        expediente.expediente
    );


    const nombreUsuario =
        localStorage.getItem("nombreUsuario") || "";


    // =====================================
    // PANTALLA
    // =====================================

    document.querySelector(".app").innerHTML = `

        <div class="pantalla-expediente">

            <header class="cabecera">

                <div>

                    <h1>ENGINEER TOOL</h1>

                    <p>
                        Imágenes del expediente
                        — ${expediente.expediente}
                    </p>

                </div>


                <div class="cabecera-derecha">

                    <div class="usuario">
                        ${nombreUsuario}
                    </div>


                    <button
                        type="button"
                        class="boton-inicio"
                        onclick="volverInicio()"
                    >
                        🏠 INICIO
                    </button>

                </div>

            </header>


            <main class="formulario-expediente">

                <h2>Imágenes</h2>

                <p class="descripcion-pantalla">
                    Añade las imágenes necesarias para
                    completar el informe.
                </p>


                <!-- =========================
                     PORTADA
                     ========================= -->

                <section class="bloque-imagen">

                    <h3>
                        Imagen de portada
                    </h3>

                    <div
                        class="zona-imagen"
                        id="zonaPortada"
                    >

                        <div
                            class="sin-imagen"
                            id="mensajePortada"
                        >

                            📷

                            <p>
                                No se ha seleccionado
                                ninguna imagen.
                            </p>

                        </div>


                        <img
                            id="previewPortada"
                            class="preview-imagen"
                            style="display:none;"
                            alt="Vista previa de portada"
                        >

                    </div>


                    <input
                        type="file"
                        id="imagenPortada"
                        accept="image/*"
                        onchange="previsualizarImagen(
                            this,
                            'previewPortada',
                            'mensajePortada'
                        )"
                    >

                </section>


                <!-- =========================
                     LOCALIZACIÓN
                     ========================= -->

                <section class="bloque-imagen">

                    <h3>
                        Imagen de localización
                    </h3>


                    <div
                        class="zona-imagen"
                        id="zonaLocalizacion"
                    >

                        <div
                            class="sin-imagen"
                            id="mensajeLocalizacion"
                        >

                            📍

                            <p>
                                No se ha seleccionado
                                ninguna imagen.
                            </p>

                        </div>


                        <img
                            id="previewLocalizacion"
                            class="preview-imagen"
                            style="display:none;"
                            alt="Vista previa de localización"
                        >

                    </div>


                    <input
                        type="file"
                        id="imagenLocalizacion"
                        accept="image/*"
                        onchange="previsualizarImagen(
                            this,
                            'previewLocalizacion',
                            'mensajeLocalizacion'
                        )"
                    >

                </section>


                <!-- =========================
                     BOTONES
                     ========================= -->

                <div class="acciones-navegacion">


                    <button
                        type="button"
                        class="boton-anterior"
                        onclick="anteriorDesdeImagenes()"
                    >
                        ← ANTERIOR
                    </button>


                    <div class="navegacion-derecha">


                        <button
                            type="button"
                            class="boton-principal"
                            onclick="guardarImagenes()"
                        >
                            GUARDAR
                        </button>


                        <button
                            type="button"
                            class="boton-siguiente"
                            onclick="mostrarCarga()"
                        >
                            PREPARAR INFORME →
                        </button>

                    </div>

                </div>

            </main>

        </div>

    `;


    // =====================================
    // RECUPERAR PORTADA
    // =====================================

    if (expediente.imagenPortada) {

        const preview =
            document.getElementById("previewPortada");

        const mensaje =
            document.getElementById("mensajePortada");


        preview.src =
            expediente.imagenPortada;

        preview.style.display =
            "block";

        mensaje.style.display =
            "none";
    }


    // =====================================
    // RECUPERAR LOCALIZACIÓN
    // =====================================

    if (expediente.imagenLocalizacion) {

        const preview =
            document.getElementById(
                "previewLocalizacion"
            );

        const mensaje =
            document.getElementById(
                "mensajeLocalizacion"
            );


        preview.src =
            expediente.imagenLocalizacion;

        preview.style.display =
            "block";

        mensaje.style.display =
            "none";
    }

}


function mostrarInicio(nombre) {

    document.querySelector(".app").innerHTML = `

        <div class="inicio">

            <header class="cabecera">

                <div>
                    <h1>ENGINEER TOOL</h1>
                    <p>Herramientas digitales de ingeniería</p>
                </div>

                <div class="usuario">
                    ${nombre}
                </div>

            </header>


            <main class="contenido-inicio">

                <h2>Inicio</h2>

                <p class="bienvenida">
                    Bienvenido, ${nombre}
                </p>


                <button
                    class="nuevo-expediente"
                    onclick="nuevoExpediente()"
                >
                    + NUEVO EXPEDIENTE
                </button>


                <section class="expedientes">

                    <h3>Expedientes recientes</h3>


                    <div id="listaExpedientes">

                        <p class="sin-expedientes">
                            Cargando expedientes...
                        </p>

                    </div>


                </section>


            </main>

        </div>

    `;


    cargarExpedientes();

}


function mostrarMedidas(expediente = null) {

    // =====================================
    // RECUPERAR EXPEDIENTE
    // =====================================

    if (!expediente) {

        const numeroExpediente =
            localStorage.getItem("expedienteActual");

        const expedientes =
            JSON.parse(
                localStorage.getItem("expedientes")
            ) || [];

        expediente = expedientes.find(
            item => item.expediente === numeroExpediente
        );
    }


    // =====================================
    // COMPROBAR EXPEDIENTE
    // =====================================

    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        volverInicio();

        return;
    }


    // =====================================
    // RECUPERAR MEDIDAS
    // =====================================

    const medidasInterior =
        expediente.medidasInterior || [];

    const medidasExterior =
        expediente.medidasExterior || [];


    const nombreUsuario =
        localStorage.getItem("nombreUsuario") || "";


    document.querySelector(".app").innerHTML = `

        <div class="pantalla-expediente">


            <!-- =========================
                 CABECERA
                 ========================= -->

            <header class="cabecera">

                <div>

                    <h1>ENGINEER TOOL</h1>

                    <p>
                        Medidas del expediente
                        — ${expediente.expediente}
                    </p>

                </div>


                <div class="cabecera-derecha">

                    <div class="usuario">
                        ${nombreUsuario}
                    </div>


                    <button
                        type="button"
                        class="boton-inicio"
                        onclick="volverInicio()"
                    >
                        🏠 INICIO
                    </button>

                </div>

            </header>



            <main class="formulario-expediente">


                <h2>Medidas</h2>


                <!-- =========================
                     AVISO
                     ========================= -->

                <div class="aviso">

                    <strong>
                        ⚠ Aviso sobre el funcionamiento
                    </strong>

                    <p>
                        Esta aplicación tiene como objetivo mostrar
                        de forma simplificada el proceso de
                        automatización de informes técnicos.
                        Por este motivo, los cálculos asociados a
                        las medidas introducidas no se realizan en
                        esta versión de demostración.
                    </p>

                </div>



                <!-- =========================
                     INTERIORES
                     ========================= -->

                <h3>
                    Medidas interiores
                </h3>


                <div class="tabla-contenedor">

                    <table id="tablaInterior">

                        <thead>

                            <tr>

                                <th>Instalación</th>
                                <th>Vivienda</th>
                                <th>Estancia</th>
                                <th>Periodo</th>
                                <th>Valor medido</th>
                                <th>Valor límite</th>
                                <th>Resultado</th>
                                <th>Acciones</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                medidasInterior.length > 0

                                ?

                                medidasInterior.map(
                                    medida => `

                                    <tr>

                                        <td>

                                            <input
                                                type="text"
                                                placeholder="Instalación"
                                                value="${medida.instalacion || ""}"
                                            >

                                        </td>


                                        <td>

                                            <input
                                                type="text"
                                                placeholder="Vivienda"
                                                value="${medida.vivienda || ""}"
                                            >

                                        </td>


                                        <td>

                                            <select
                                                onchange="actualizarLimiteInterior(this)"
                                            >

                                                <option value="">
                                                    Seleccionar
                                                </option>

                                                <option
                                                    value="salon"
                                                    ${medida.estancia === "salon"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Salón
                                                </option>

                                                <option
                                                    value="oficina"
                                                    ${medida.estancia === "oficina"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Oficina
                                                </option>

                                                <option
                                                    value="dormitorio"
                                                    ${medida.estancia === "dormitorio"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Dormitorio
                                                </option>

                                            </select>

                                        </td>


                                        <td>

                                            <select
                                                onchange="actualizarLimiteInterior(this)"
                                            >

                                                <option value="">
                                                    Seleccionar
                                                </option>

                                                <option
                                                    value="Día"
                                                    ${medida.periodo === "Día"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Día
                                                </option>

                                                <option
                                                    value="Vespertino"
                                                    ${medida.periodo === "Vespertino"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Vespertino
                                                </option>

                                                <option
                                                    value="Nocturno"
                                                    ${medida.periodo === "Nocturno"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Nocturno
                                                </option>

                                            </select>

                                        </td>


                                        <td>

                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="dB"
                                                value="${medida.valorMedido || ""}"
                                                oninput="actualizarResultado(
                                                    this.closest('tr')
                                                )"
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
                                                onclick="eliminarMedida(this)"
                                                title="Eliminar medida"
                                            >
                                                ×
                                            </button>

                                        </td>

                                    </tr>

                                `
                                ).join("")

                                :

                                `

                                    <tr>

                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Instalación"
                                            >
                                        </td>


                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Vivienda"
                                            >
                                        </td>


                                        <td>

                                            <select
                                                onchange="actualizarLimiteInterior(this)"
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
                                                onchange="actualizarLimiteInterior(this)"
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
                                                placeholder="dB"
                                                oninput="actualizarResultado(
                                                    this.closest('tr')
                                                )"
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
                                                onclick="eliminarMedida(this)"
                                                title="Eliminar medida"
                                            >
                                                ×
                                            </button>

                                        </td>

                                    </tr>

                                `
                            }

                        </tbody>

                    </table>

                </div>


                <button
                    type="button"
                    class="boton-secundario"
                    onclick="anadirMedidaInterior()"
                >
                    + Añadir medida interior
                </button>



                <!-- =========================
                     EXTERIORES
                     ========================= -->

                <h3 class="titulo-exterior">
                    Medidas exteriores
                </h3>


                <div class="tabla-contenedor">

                    <table id="tablaExterior">

                        <thead>

                            <tr>

                                <th>Instalación</th>
                                <th>Vivienda</th>
                                <th>Zona exterior</th>
                                <th>Periodo</th>
                                <th>Valor medido</th>
                                <th>Valor límite</th>
                                <th>Resultado</th>
                                <th>Acciones</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                medidasExterior.length > 0

                                ?

                                medidasExterior.map(
                                    medida => `

                                    <tr>

                                        <td>

                                            <input
                                                type="text"
                                                placeholder="Instalación"
                                                value="${medida.instalacion || ""}"
                                            >

                                        </td>


                                        <td>

                                            <input
                                                type="text"
                                                placeholder="Vivienda"
                                                value="${medida.vivienda || ""}"
                                            >

                                        </td>


                                        <td>

                                            <input
                                                type="text"
                                                placeholder="Zona exterior"
                                                value="${medida.zonaExterior || ""}"
                                            >

                                        </td>


                                        <td>

                                            <select
                                                onchange="actualizarLimiteExterior(this)"
                                            >

                                                <option value="">
                                                    Seleccionar
                                                </option>

                                                <option
                                                    value="Día"
                                                    ${medida.periodo === "Día"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Día
                                                </option>

                                                <option
                                                    value="Vespertino"
                                                    ${medida.periodo === "Vespertino"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Vespertino
                                                </option>

                                                <option
                                                    value="Nocturno"
                                                    ${medida.periodo === "Nocturno"
                                                        ? "selected"
                                                        : ""}
                                                >
                                                    Nocturno
                                                </option>

                                            </select>

                                        </td>


                                        <td>

                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="dB"
                                                value="${medida.valorMedido || ""}"
                                                oninput="actualizarResultadoExterior(
                                                    this.closest('tr')
                                                )"
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
                                                onclick="eliminarMedida(this)"
                                                title="Eliminar medida"
                                            >
                                                ×
                                            </button>

                                        </td>

                                    </tr>

                                `
                                ).join("")

                                :

                                `

                                    <tr>

                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Instalación"
                                            >
                                        </td>


                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Vivienda"
                                            >
                                        </td>


                                        <td>
                                            <input
                                                type="text"
                                                placeholder="Zona exterior"
                                            >
                                        </td>


                                        <td>

                                            <select
                                                onchange="actualizarLimiteExterior(this)"
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
                                                placeholder="dB"
                                                oninput="actualizarResultadoExterior(
                                                    this.closest('tr')
                                                )"
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
                                                onclick="eliminarMedida(this)"
                                                title="Eliminar medida"
                                            >
                                                ×
                                            </button>

                                        </td>

                                    </tr>

                                `
                            }

                        </tbody>

                    </table>

                </div>


                <button
                    type="button"
                    class="boton-secundario"
                    onclick="anadirMedidaExterior()"
                >
                    + Añadir medida exterior
                </button>



                <!-- =========================
                     NAVEGACIÓN
                     ========================= -->

                <div class="acciones-navegacion">


                    <button
                        type="button"
                        class="boton-anterior"
                        onclick="anteriorDesdeMedidas()"
                    >
                        ← ANTERIOR
                    </button>


                    <div class="navegacion-derecha">


                        <button
                            type="button"
                            class="boton-principal"
                            onclick="guardarMedidas()"
                        >
                            GUARDAR
                        </button>


                        <button
                            type="button"
                            class="boton-siguiente"
                            onclick="siguienteDesdeMedidas()"
                        >
                            SIGUIENTE →
                        </button>

                    </div>

                </div>


            </main>

        </div>

    `;


    // =====================================
    // RECALCULAR LÍMITES
    // =====================================

    document
        .querySelectorAll("#tablaInterior tbody tr")
        .forEach(fila => {

            const selects =
                fila.querySelectorAll("select");

            if (
                selects.length >= 2 &&
                selects[0].value !== "" &&
                selects[1].value !== ""
            ) {

                actualizarLimiteInterior(
                    selects[0]
                );
            }

        });


    document
        .querySelectorAll("#tablaExterior tbody tr")
        .forEach(fila => {

            const select =
                fila.querySelector("select");

            if (
                select &&
                select.value !== ""
            ) {

                actualizarLimiteExterior(
                    select
                );
            }

        });

}


function mostrarPDFInforme(
    pdfURL,
    numeroExpediente
) {

    console.log(
        "========================================"
    );

    console.log(
        "MOSTRANDO PDF GENERADO"
    );

    console.log(
        "========================================"
    );


    // =====================================================
    // COMPROBAR URL
    // =====================================================

    if (!pdfURL) {

        console.error(
            "No se ha recibido ninguna URL del PDF."
        );

        return;

    }


    console.log(
        "PDF URL:",
        pdfURL
    );


    // =====================================================
    // BUSCAR CONTENEDOR PRINCIPAL
    // =====================================================

    const app =
        document.querySelector(
            ".app"
        );


    if (!app) {

        console.error(
            "No se ha encontrado el contenedor principal .app."
        );

        return;

    }


    // =====================================================
    // ELIMINAR VISOR ANTERIOR SI EXISTE
    // =====================================================

    const visorAnterior =
        document.getElementById(
            "visorPDF"
        );


    if (visorAnterior) {

        visorAnterior.remove();

    }


    // =====================================================
    // CREAR CONTENEDOR DEL VISOR
    // =====================================================

    const visor =
        document.createElement(
            "div"
        );


    visor.id =
        "visorPDF";


    visor.style.width =
        "100%";


    visor.style.marginTop =
        "40px";


    visor.style.padding =
        "25px";


    visor.style.boxSizing =
        "border-box";


    visor.style.background =
        "#ffffff";


    visor.style.border =
        "1px solid #d0d0d0";


    visor.style.borderRadius =
        "8px";


    // =====================================================
    // TÍTULO
    // =====================================================

    const titulo =
        document.createElement(
            "h2"
        );


    titulo.textContent =
        "Informe generado";


    titulo.style.marginTop =
        "0";


    titulo.style.marginBottom =
        "10px";


    visor.appendChild(
        titulo
    );


    // =====================================================
    // INFORMACIÓN
    // =====================================================

    const informacion =
        document.createElement(
            "p"
        );


    informacion.textContent =
        "El informe técnico se ha generado correctamente.";


    informacion.style.marginBottom =
        "20px";


    visor.appendChild(
        informacion
    );


    // =====================================================
    // IFRAME PDF
    // =====================================================

    const frame =
        document.createElement(
            "iframe"
        );


    frame.id =
        "pdfFrame";


    frame.title =
        "Vista previa del informe PDF";


    frame.src =
        pdfURL;


    frame.style.display =
        "block";


    frame.style.width =
        "100%";


    frame.style.height =
        "800px";


    frame.style.border =
        "1px solid #cccccc";


    frame.style.borderRadius =
        "6px";


    frame.style.background =
        "#ffffff";


    frame.style.boxSizing =
        "border-box";


    visor.appendChild(
        frame
    );


    // =====================================================
    // CONTENEDOR BOTONES
    // =====================================================

    const botones =
        document.createElement(
            "div"
        );


    botones.style.marginTop =
        "20px";


    botones.style.textAlign =
        "center";


    // =====================================================
    // BOTÓN DESCARGAR
    // =====================================================

    const botonDescargar =
        document.createElement(
            "button"
        );


    botonDescargar.id =
        "descargarPDF";


    botonDescargar.type =
        "button";


    botonDescargar.textContent =
        "DESCARGAR PDF";


    botonDescargar.style.padding =
        "12px 25px";


    botonDescargar.style.cursor =
        "pointer";


    botonDescargar.style.fontSize =
        "14px";


    botonDescargar.style.fontWeight =
        "bold";


    botonDescargar.style.border =
        "none";


    botonDescargar.style.borderRadius =
        "5px";


    botonDescargar.style.background =
        "#1769aa";


    botonDescargar.style.color =
        "#ffffff";


    // =====================================================
    // FUNCIÓN DESCARGA
    // =====================================================

    botonDescargar.addEventListener(
        "click",
        function () {

            console.log(
                "Descargando PDF..."
            );


            const enlace =
                document.createElement(
                    "a"
                );


            enlace.href =
                pdfURL;


            // -------------------------------------------------
            // NOMBRE DEL ARCHIVO
            // -------------------------------------------------

            let nombreArchivo =
                "Informe.pdf";


            if (
                numeroExpediente
            ) {

                nombreArchivo =
                    String(
                        numeroExpediente
                    )
                    .replace(
                        /[\\/:*?"<>|]/g,
                        "_"
                    ) +
                    "_Informe.pdf";

            }


            enlace.download =
                nombreArchivo;


            // -------------------------------------------------
            // EJECUTAR DESCARGA
            // -------------------------------------------------

            document.body.appendChild(
                enlace
            );


            enlace.click();


            document.body.removeChild(
                enlace
            );


            console.log(
                "Descarga iniciada:",
                nombreArchivo
            );

        }
    );


    botones.appendChild(
        botonDescargar
    );


    visor.appendChild(
        botones
    );


    // =====================================================
    // INSERTAR VISOR EN LA PÁGINA
    // =====================================================

    app.appendChild(
        visor
    );


    // =====================================================
    // MOSTRAR VISOR
    // =====================================================

    visor.style.display =
        "block";


    // =====================================================
    // DESPLAZARSE AL VISOR
    // =====================================================

    setTimeout(
        function () {

            visor.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );


    // =====================================================
    // INFORMACIÓN CONSOLA
    // =====================================================

    console.log(
        "Visor PDF creado correctamente."
    );


    console.log(
        "Iframe creado correctamente."
    );


    console.log(
        "Botón de descarga creado correctamente."
    );


    console.log(
        "========================================"
    );

}


function nuevoExpediente() {

    // No hay expediente cargado

    localStorage.removeItem("expedienteActual");

    localStorage.removeItem("expedienteCargado");


    // Abrir formulario vacío

    mostrarDatos();

}


function ponerPrimeraMayuscula(texto) {

    if (!texto) {
        return "";
    }

    texto =
        String(texto).trim();

    return (
        texto.charAt(0).toUpperCase() +
        texto.slice(1)
    );

}


function prepararDatosInforme(expediente = null) {

    // =====================================
    // RECUPERAR EXPEDIENTE ACTUAL
    // =====================================

    if (!expediente) {

        const numeroExpediente =
            localStorage.getItem("expedienteActual");

        const expedientes =
            JSON.parse(
                localStorage.getItem("expedientes")
            ) || [];

        expediente = expedientes.find(
            item =>
                item.expediente === numeroExpediente
        );
    }


    // =====================================
    // COMPROBAR EXPEDIENTE
    // =====================================

    if (!expediente) {

        console.error(
            "No se ha encontrado el expediente."
        );

        return null;
    }


    // =====================================
    // DATOS GENERALES
    // =====================================

    const datos = {

        Nexpediente:
            expediente.expediente || "",

        Obra:
            expediente.obra || "",

        Peticionario:
            expediente.peticionario || "",

        viviendasestudio:
            expediente.tipo || "",

        fechasvisita:
            expediente.fechas || [],

        localizacion:
            expediente.localizacion || "",

        medidasInterior:
            expediente.medidasInterior || [],

        medidasExterior:
            expediente.medidasExterior || [],

        imagenPortada:
            expediente.imagenPortada || null,

        imagenLocalizacion:
            expediente.imagenLocalizacion || null

    };


    // =====================================
    // DATOS DE MÁQUINAS
    // =====================================

    const filasMaquinas = [];


    // INTERIORES PRIMERO

    datos.medidasInterior.forEach(
        medida => {

            if (
                medida.instalacion &&
                medida.estancia
            ) {

                filasMaquinas.push({

                    instalacion:
                        medida.instalacion,

                    estancia:
                        medida.estancia

                });

            }

        }
    );


    // EXTERIORES DESPUÉS

    datos.medidasExterior.forEach(
        medida => {

            if (
                medida.instalacion &&
                medida.zonaExterior
            ) {

                filasMaquinas.push({

                    instalacion:
                        medida.instalacion,

                    estancia:
                        medida.zonaExterior

                });

            }

        }
    );


    // =====================================
    // CONSTRUIR DATOSMAQUINAS PARA LATEX
    // =====================================

    let datosMaquinas = "";


    filasMaquinas.forEach(
        fila => {

            datosMaquinas +=
                `${escaparLatex(fila.instalacion)} & ` +
                `${escaparLatex(fila.estancia)} ` +
                `\\\\ \\hline\n`;

        }
    );


    datos.datosMaquinas =
        datosMaquinas;


    // =====================================
    // MOSTRAR RESULTADO EN CONSOLA
    // =====================================

    console.log(
        "================================="
    );

    console.log(
        "DATOS PREPARADOS PARA LATEX"
    );

    console.log(
        "================================="
    );

    console.log(
        datos
    );


    console.log(
        "DATOS MAQUINAS:"
    );

    console.log(
        datos.datosMaquinas
    );


    return datos;

}


function previsualizarImagen(
    input,
    idPreview,
    idMensaje
) {

    const archivo = input.files[0];

    if (!archivo) {
        return;
    }


    // Comprobar que sea una imagen

    if (!archivo.type.startsWith("image/")) {

        alert(
            "El archivo seleccionado no es una imagen."
        );

        input.value = "";

        return;
    }


    const lector = new FileReader();


    lector.onload = function(evento) {

        const preview =
            document.getElementById(
                idPreview
            );

        const mensaje =
            document.getElementById(
                idMensaje
            );


        preview.src =
            evento.target.result;

        preview.style.display =
            "block";

        mensaje.style.display =
            "none";
    };


    lector.readAsDataURL(archivo);

}


async function probarCompiladorLatex() {

    console.log("Probando compilador LaTeX...");

    const latex = `
\\documentclass{article}

\\usepackage[utf8]{inputenc}

\\begin{document}

\\begin{center}

{\\LARGE \\textbf{ENGINEER TOOL}}

\\vspace{1cm}

Prueba de generación de PDF.

\\vspace{0.5cm}

Si estás viendo esta página dentro de la aplicación,
la previsualización funciona correctamente.

\\end{center}

\\end{document}
`;

    try {

        const url =
            "https://latexonline.cc/compile?text=" +
            encodeURIComponent(latex);

        console.log("Enviando documento al compilador...");

        const respuesta =
            await fetch(url);

        if (!respuesta.ok) {

            throw new Error(
                "El compilador ha respondido con HTTP " +
                respuesta.status
            );

        }

        const pdfBlob =
            await respuesta.blob();

        const pdfURL =
            URL.createObjectURL(pdfBlob);

        console.log("PDF recibido correctamente.");

        mostrarPDFInforme(pdfURL);

    }
    catch (error) {

        console.error(
            "Error al generar el PDF:",
            error
        );

        alert(
            "No se ha podido generar el PDF:\n\n" +
            error.message
        );

    }
}


function siguienteDesdeDatos() {

    const guardado =
        guardarDatos(false);


    if (!guardado) {
        return;
    }


    const numeroExpediente =
        localStorage.getItem(
            "expedienteActual"
        );


    const expedientes =
        JSON.parse(
            localStorage.getItem(
                "expedientes"
            )
        ) || [];


    const expediente =
        expedientes.find(
            item =>
                item.expediente ===
                numeroExpediente
        );


    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        return;
    }


    mostrarMedidas(
        expediente
    );

}


function siguienteDesdeMedidas() {

    const guardado =
        guardarMedidas(false);


    if (!guardado) {
        return;
    }


    const numeroExpediente =
        localStorage.getItem(
            "expedienteActual"
        );


    const expedientes =
        JSON.parse(
            localStorage.getItem(
                "expedientes"
            )
        ) || [];


    const expediente =
        expedientes.find(
            item =>
                item.expediente ===
                numeroExpediente
        );


    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        return;
    }


    mostrarImagenes(
        expediente
    );

}


function volverAImagenes() {

    const numeroExpediente =
        localStorage.getItem("expedienteActual");


    const expedientes =
        JSON.parse(
            localStorage.getItem("expedientes")
        ) || [];


    const expediente =
        expedientes.find(
            item =>
                item.expediente === numeroExpediente
        );


    if (!expediente) {

        alert(
            "No se ha encontrado el expediente."
        );

        volverInicio();

        return;
    }


    mostrarImagenes(expediente);
}

// =========================================================
// CONVERTIR DATA URL A BLOB
// =========================================================


function volverInicio() {

    const nombre = localStorage.getItem("nombreUsuario");

    mostrarInicio(nombre);

}

/* =========================================================
   ADAPTACIÓN PARA LA DEMO ONLINE
   ========================================================= */

function fechaHoyISO() {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset();
    return new Date(ahora.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    const partes = fecha.split("-");
    if (partes.length !== 3) return fecha;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function calcularLimiteDemo(tipo, estancia, periodo) {
    if (!periodo) return null;
    if (tipo === "interior") {
        if (estancia === "salon" || estancia === "oficina") {
            return (periodo === "Día" || periodo === "Vespertino") ? 45 : periodo === "Nocturno" ? 35 : null;
        }
        if (estancia === "dormitorio") {
            return (periodo === "Día" || periodo === "Vespertino") ? 40 : periodo === "Nocturno" ? 30 : null;
        }
    }
    if (tipo === "exterior") {
        const base = (periodo === "Día" || periodo === "Vespertino") ? 55 : periodo === "Nocturno" ? 45 : null;
        return base === null ? null : base + 5;
    }
    return null;
}

function actualizarFilaInteriorDemo(fila) {
    const selects = fila.querySelectorAll("select");
    const estancia = selects[0]?.value || "";
    const periodo = selects[1]?.value || "";
    const valor = parseFloat(fila.querySelector('input[type="number"]')?.value);
    const limite = calcularLimiteDemo("interior", estancia, periodo);
    const celdaLimite = fila.querySelector(".limite");
    const celdaResultado = fila.querySelector(".resultado");
    celdaLimite.textContent = limite === null ? "—" : `${limite} dB`;
    if (Number.isNaN(valor) || limite === null) {
        celdaResultado.textContent = "—";
        celdaResultado.className = "resultado resultado-celda";
    } else if (valor <= limite) {
        celdaResultado.textContent = "CUMPLE";
        celdaResultado.className = "resultado resultado-celda cumple";
    } else {
        celdaResultado.textContent = "NO CUMPLE";
        celdaResultado.className = "resultado resultado-celda no-cumple";
    }
    actualizarResumenDemo();
}

function actualizarFilaExteriorDemo(fila) {
    const periodo = fila.querySelector("select")?.value || "";
    const valor = parseFloat(fila.querySelector('input[type="number"]')?.value);
    const limite = calcularLimiteDemo("exterior", "", periodo);
    const celdaLimite = fila.querySelector(".limite");
    const celdaResultado = fila.querySelector(".resultado");
    celdaLimite.textContent = limite === null ? "—" : `${limite} dB (+5)`;
    if (Number.isNaN(valor) || limite === null) {
        celdaResultado.textContent = "—";
        celdaResultado.className = "resultado resultado-celda";
    } else if (valor <= limite) {
        celdaResultado.textContent = "CUMPLE";
        celdaResultado.className = "resultado resultado-celda cumple";
    } else {
        celdaResultado.textContent = "NO CUMPLE";
        celdaResultado.className = "resultado resultado-celda no-cumple";
    }
    actualizarResumenDemo();
}

function prepararFilaInteriorDemo(fila) {
    fila.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", () => actualizarFilaInteriorDemo(fila));
    });
    const input = fila.querySelector('input[type="number"]');
    if (input) input.addEventListener("input", () => actualizarFilaInteriorDemo(fila));
    actualizarFilaInteriorDemo(fila);
}

function prepararFilaExteriorDemo(fila) {
    fila.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", () => actualizarFilaExteriorDemo(fila));
    });
    const input = fila.querySelector('input[type="number"]');
    if (input) input.addEventListener("input", () => actualizarFilaExteriorDemo(fila));
    actualizarFilaExteriorDemo(fila);
}

const anadirMedidaInteriorOriginal = anadirMedidaInterior;
const anadirMedidaExteriorOriginal = anadirMedidaExterior;

anadirMedidaInterior = function () {
    anadirMedidaInteriorOriginal();
    const filas = document.querySelectorAll("#tablaInterior tbody tr");
    const fila = filas[filas.length - 1];
    if (fila) prepararFilaInteriorDemo(fila);
    actualizarResumenDemo();
};

anadirMedidaExterior = function () {
    anadirMedidaExteriorOriginal();
    const filas = document.querySelectorAll("#tablaExterior tbody tr");
    const fila = filas[filas.length - 1];
    if (fila) prepararFilaExteriorDemo(fila);
    actualizarResumenDemo();
};

function eliminarMedidaDemo(boton) {
    const fila = boton.closest("tr");
    if (fila) fila.remove();
    actualizarResumenDemo();
}

function actualizarResumenDemo() {
    const filas = [
        ...document.querySelectorAll("#tablaInterior tbody tr"),
        ...document.querySelectorAll("#tablaExterior tbody tr")
    ];
    let completas = 0;
    let cumplen = 0;
    let noCumplen = 0;
    filas.forEach(fila => {
        const resultado = fila.querySelector(".resultado")?.textContent.trim();
        if (resultado === "CUMPLE") { completas++; cumplen++; }
        if (resultado === "NO CUMPLE") { completas++; noCumplen++; }
    });
    document.getElementById("totalMedidas").textContent = filas.length;
    document.getElementById("totalCumplen").textContent = cumplen;
    document.getElementById("totalNoCumplen").textContent = noCumplen;
    const global = document.getElementById("resultadoGlobal");
    global.className = "resultado-global";
    if (completas === 0) {
        global.classList.add("pendiente");
        global.textContent = "Introduce al menos una medición completa.";
    } else if (noCumplen > 0) {
        global.classList.add("no-cumple");
        global.textContent = `RESULTADO GLOBAL: NO CUMPLE · ${noCumplen} medición(es) fuera de límite`;
    } else {
        global.classList.add("cumple");
        global.textContent = `RESULTADO GLOBAL: CUMPLE · ${cumplen} medición(es) dentro de límite`;
    }
}

function recogerMedidasDemo() {
    const interiores = [];
    document.querySelectorAll("#tablaInterior tbody tr").forEach(fila => {
        const inputs = fila.querySelectorAll("input");
        const selects = fila.querySelectorAll("select");
        const instalacion = inputs[0]?.value.trim() || "";
        const vivienda = inputs[1]?.value.trim() || "";
        const valorMedido = inputs[2]?.value.trim() || "";
        const estancia = selects[0]?.value || "";
        const periodo = selects[1]?.value || "";
        if (instalacion || vivienda || valorMedido || estancia || periodo) {
            interiores.push({ instalacion, vivienda, estancia, periodo, valorMedido });
        }
    });
    const exteriores = [];
    document.querySelectorAll("#tablaExterior tbody tr").forEach(fila => {
        const inputs = fila.querySelectorAll("input");
        const instalacion = inputs[0]?.value.trim() || "";
        const vivienda = inputs[1]?.value.trim() || "";
        const zonaExterior = inputs[2]?.value.trim() || "";
        const valorMedido = inputs[3]?.value.trim() || "";
        const periodo = fila.querySelector("select")?.value || "";
        if (instalacion || vivienda || zonaExterior || valorMedido || periodo) {
            exteriores.push({ instalacion, vivienda, zonaExterior, periodo, valorMedido });
        }
    });
    return { interiores, exteriores };
}

function validarDemo() {
    const obligatorios = ["nombre", "obra", "peticionario", "expediente", "localizacion"];
    for (const id of obligatorios) {
        if (!document.getElementById(id).value.trim()) {
            alert(`Completa el campo: ${id}`);
            document.getElementById(id).focus();
            return false;
        }
    }
    const { interiores, exteriores } = recogerMedidasDemo();
    if (interiores.length + exteriores.length === 0) {
        alert("Añade al menos una medición.");
        return false;
    }
    const filas = [
        ...document.querySelectorAll("#tablaInterior tbody tr"),
        ...document.querySelectorAll("#tablaExterior tbody tr")
    ];
    const incompletas = filas.some(fila => {
        const resultado = fila.querySelector(".resultado")?.textContent.trim();
        const tieneDatos = [...fila.querySelectorAll("input, select")].some(e => e.value.trim() !== "");
        return tieneDatos && resultado === "—";
    });
    if (incompletas) {
        alert("Hay alguna medición incompleta. Completa estancia, periodo y nivel medido antes de generar el informe.");
        return false;
    }
    return true;
}

async function adaptarFormularioYGenerar() {
    if (!validarDemo()) return;
    const boton = document.getElementById("generarInforme");
    boton.disabled = true;
    boton.textContent = "GENERANDO INFORME...";
    try {
        const fecha = document.getElementById("fecha").value || fechaHoyISO();
        const fechas = Array.from(document.querySelectorAll("#fechas input[type='date']"))
            .map(input => input.value).filter(Boolean);
        if (fechas.length === 0) fechas.push(fecha);
        const { interiores, exteriores } = recogerMedidasDemo();
        const expediente = {
            obra: document.getElementById("obra").value.trim(),
            tipo: "vivienda",
            expediente: document.getElementById("expediente").value.trim(),
            peticionario: document.getElementById("peticionario").value.trim(),
            localizacion: document.getElementById("localizacion").value.trim(),
            fechas,
            fechasvisita: fechas.map(formatearFecha).join(", "),
            viviendasestudio: "viviendas",
            creadoPor: document.getElementById("nombre").value.trim(),
            estado: "En curso",
            medidasInterior: interiores,
            medidasExterior: exteriores,
            imagenPortada: null,
            imagenLocalizacion: null
        };
        localStorage.setItem("nombreUsuario", expediente.creadoPor);
        localStorage.setItem("expedientes", JSON.stringify([expediente]));
        localStorage.setItem("expedienteActual", expediente.expediente);
        localStorage.setItem("expedienteCargado", JSON.stringify(expediente));
        await generarInforme();
    } catch (error) {
        console.error("Error en la adaptación de la demo:", error);
        alert("No se ha podido generar el informe: " + (error.message || error));
    } finally {
        boton.disabled = false;
        boton.textContent = "GENERAR INFORME";
    }
}

function inicializarDemoOnline() {
    const fecha = document.getElementById("fecha");
    if (fecha && !fecha.value) fecha.value = fechaHoyISO();
    const fechaVisita = document.querySelector("#fechas input[type='date']");
    if (fechaVisita && !fechaVisita.value) fechaVisita.value = fecha?.value || fechaHoyISO();
    anadirMedidaInterior();
    anadirMedidaExterior();
    actualizarResumenDemo();
}

document.addEventListener("DOMContentLoaded", inicializarDemoOnline);


const eliminarMedidaOriginal = eliminarMedida;
eliminarMedida = function (boton) {
    eliminarMedidaOriginal(boton);
    actualizarResumenDemo();
};
