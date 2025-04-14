document.addEventListener("DOMContentLoaded", () => {
    const selectEspecialidad = document.getElementById("especialidad");
    const selectHora = document.getElementById("hora");
    const formularioEspecialidad = document.getElementById("formulario-especialidad");
    const formularioTurno = document.getElementById("formulario-turno");
    const listaCitas = document.getElementById("lista-citas");
    const listaCitasConfirmadas = document.getElementById("lista-citas-confirmadas");
    const confirmacionCitas = document.getElementById("confirmacion-citas");
    const botonConfirmar = document.getElementById("confirmar-citas");

    // Obtiene la fecha actual
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const yyyy = today.getFullYear();

    // Formatea la fecha en formato YYYY-MM-DD
    const formattedDate = yyyy + '-' + mm + '-' + dd;

    // Asigna la fecha actual como la fecha mínima para el input
    document.getElementById('dia').setAttribute('min', formattedDate);

    // El resto del código sigue igual...
    fetch("../data/data.json")
    .then((res) => res.json())
    .then((especialidades) => {
        especialidades.forEach((especialidad) => {
            const option = document.createElement("option");
            option.value = especialidad;
            option.textContent = especialidad;
            selectEspecialidad.appendChild(option);
        });
    })
    .catch((error) => {
        console.error("Error al cargar especialidades:", error);
    });

    let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    let citasSeleccionadas = JSON.parse(localStorage.getItem("citasSeleccionadas")) || [];
    let especialidadesSeleccionadas = JSON.parse(localStorage.getItem("especialidadesSeleccionadas")) || [];
    let rangosHorasSeleccionados = JSON.parse(localStorage.getItem("rangosHorasSeleccionados")) || [];

    if (citasSeleccionadas.length > 0) {
        mostrarCitasSeleccionadas();
        formularioTurno.style.display = "none";
        selectEspecialidad.querySelectorAll("option").forEach(option => {
            option.disabled = especialidadesSeleccionadas.some(
                especialidadObj => especialidadObj.nombre === option.value
            );
        });
        
    }

    const especialidadGuardada = JSON.parse(localStorage.getItem("especialidadSeleccionada"));
    const fechaGuardada = localStorage.getItem("fechaSeleccionada");
    const horaGuardada = localStorage.getItem("horaSeleccionada");

    if (especialidadGuardada) {
        selectEspecialidad.value = especialidadGuardada.nombre;
        formularioEspecialidad.dispatchEvent(new Event("submit"));
    }

    if (fechaGuardada && horaGuardada) {
        document.getElementById("dia").value = fechaGuardada;
        selectHora.value = horaGuardada;
    }

    const estadoCitas = localStorage.getItem("estadoCitas");

    if (estadoCitas === "confirmadas") {
        formularioEspecialidad.style.display = "none";
        formularioTurno.style.display = "none";
        confirmacionCitas.style.display = "none";
        listaCitas.style.display = "none";
        listaCitasConfirmadas.style.display = "block";
        document.getElementById("citas-confirmadas").style.display = "block";
        mostrarCitasConfirmadas(turnos);
    }

    formularioEspecialidad.addEventListener("submit", (e) => {
        e.preventDefault();
        const especialidad = selectEspecialidad.value;

        if (!especialidad) {
            Swal.fire("¡Error!", "Por favor selecciona una especialidad", "error");
            return;
        }

        if (especialidadesSeleccionadas.includes(especialidad)) {
            Swal.fire("¡Error!", "Ya seleccionaste esta especialidad. Elige otra.", "error");
            return;
        }

        especialidadesSeleccionadas.push({ nombre: especialidad });
        localStorage.setItem("especialidadSeleccionada", JSON.stringify({ nombre: especialidad }));

        selectEspecialidad.querySelectorAll("option").forEach(option => {
            option.disabled = especialidadesSeleccionadas.some(especialidadObj => especialidadObj.nombre === option.value);
        });

        formularioTurno.style.display = "block";
        formularioTurno.dataset.especialidad = especialidad;
        habilitarHoras();
    });

    formularioTurno.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const especialidad = formularioTurno.dataset.especialidad;
        const fecha = document.getElementById("dia").value;
        const rangoHora = selectHora.value;
    
        // Validar que se haya seleccionado fecha y hora
        if (!fecha || !rangoHora) {
            Swal.fire("¡Error!", "Debes seleccionar fecha y hora", "error");
            return;
        }
    
        // Validar que la fecha seleccionada no sea una fecha pasada
        const hoy = new Date().toISOString().split("T")[0]; // Obtener fecha actual en formato YYYY-MM-DD
        if (fecha < hoy) {
            Swal.fire("¡Error!", "No puedes seleccionar una fecha pasada", "error");
            return;
        }
    
        // Verificar si ya existe una cita en la misma fecha y hora
        const citaExistente = citasSeleccionadas.some(
            cita => cita.fecha === fecha && cita.rangoHora === rangoHora
        );
        if (citaExistente || rangosHorasSeleccionados.includes(rangoHora)) {
            Swal.fire("¡Error!", "Este rango ya está ocupado", "error");
            return;
        }
    
        // Guardar la información seleccionada en el localStorage
        localStorage.setItem("fechaSeleccionada", fecha);
        localStorage.setItem("horaSeleccionada", rangoHora);
    
        rangosHorasSeleccionados.push(rangoHora);
        citasSeleccionadas.push({ especialidad, fecha, rangoHora });
    
        localStorage.setItem("citasSeleccionadas", JSON.stringify(citasSeleccionadas));
        localStorage.setItem("especialidadesSeleccionadas", JSON.stringify(especialidadesSeleccionadas));
        localStorage.setItem("rangosHorasSeleccionados", JSON.stringify(rangosHorasSeleccionados));
    
        // Mostrar las citas seleccionadas
        mostrarCitasSeleccionadas();
        formularioTurno.reset();
        formularioTurno.style.display = "none";
        selectEspecialidad.value = ""; // Resetear el campo de especialidad
    });
    

    function mostrarCitasSeleccionadas() {
        // Limpiar la lista antes de volver a renderizar las citas
        while (listaCitas.firstChild) {
            listaCitas.removeChild(listaCitas.firstChild);
        }
    
        // Verificar si hay citas seleccionadas
        console.log("Citas seleccionadas:", citasSeleccionadas);
    
        // Crear el contenedor para las citas
        const contenedorCitas = document.createElement("div");
        contenedorCitas.classList.add("citas-recuadro");
    
        // Iterar sobre las citas seleccionadas y agregarlas al contenedor
        citasSeleccionadas.forEach((cita, index) => {
            const li = document.createElement("li");
    
            const especialidadSpan = document.createElement("span");
            especialidadSpan.textContent = cita.especialidad;
            li.appendChild(especialidadSpan);
    
            const fechaSpan = document.createElement("span");
            fechaSpan.textContent = cita.fecha;
            li.appendChild(fechaSpan);
    
            const horaSpan = document.createElement("span");
            horaSpan.textContent = cita.rangoHora;
            li.appendChild(horaSpan);
    
            // Crear el botón "X" para eliminar la cita
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "X";
            botonEliminar.classList.add("btn-eliminar");
            botonEliminar.addEventListener("click", () => {
                // Eliminar la cita del array
                const citaEliminada = citasSeleccionadas[index];
                citasSeleccionadas.splice(index, 1);

                // Eliminar de rangosHorasSeleccionados
                rangosHorasSeleccionados = rangosHorasSeleccionados.filter(hora => hora !== citaEliminada.rangoHora);

                // Eliminar de especialidadesSeleccionadas
                especialidadesSeleccionadas = especialidadesSeleccionadas.filter(
                especialidad => especialidad.nombre !== citaEliminada.especialidad
                );

                // Actualizar localStorage
                localStorage.setItem("rangosHorasSeleccionados", JSON.stringify(rangosHorasSeleccionados));
                localStorage.setItem("especialidadesSeleccionadas", JSON.stringify(especialidadesSeleccionadas));
                // Actualizar el localStorage
                localStorage.setItem("citasSeleccionadas", JSON.stringify(citasSeleccionadas));
            
                // Volver a mostrar las citas actualizadas
                mostrarCitasSeleccionadas();
            
                // Habilitar las horas nuevamente
                habilitarHoras();
            
                // Habilitar las especialidades nuevamente
           selectEspecialidad.querySelectorAll("option").forEach(option => {
    option.disabled = especialidadesSeleccionadas.some(
        especialidad => especialidad.nombre === option.value
    );


                });
            });
    
            li.appendChild(botonEliminar);
            contenedorCitas.appendChild(li);
        });
    
        // Agregar las citas al contenedor en el HTML
        listaCitas.appendChild(contenedorCitas);
        confirmacionCitas.style.display = citasSeleccionadas.length > 0 ? "block" : "none";
    }
    function habilitarHoras() {
        const rangosHorasDisponibles = [
            "08:00 - 09:00",
            "09:00 - 10:00",
            "10:00 - 11:00",
            "11:00 - 12:00",
            "14:00 - 15:00",
            "15:00 - 16:00"
        ];
    
        // Limpiar las opciones actuales
        while (selectHora.firstChild) {
            selectHora.removeChild(selectHora.firstChild);
        }
    
        // Deshabilitar las horas ya seleccionadas
        rangosHorasDisponibles.forEach(rango => {
            const option = document.createElement("option");
            option.value = rango;
            option.textContent = rango;
            option.disabled = rangosHorasSeleccionados.includes(rango); // Deshabilitar si la hora ya está seleccionada
            selectHora.appendChild(option);
        });
    }

    botonConfirmar.addEventListener("click", () => {
        if (citasSeleccionadas.length === 0) return;
    
        const contenedorResumen = document.createElement("div");
        citasSeleccionadas.forEach(cita => {
            const citaDiv = document.createElement("div");
            citaDiv.style.display = "flex";
            citaDiv.style.justifyContent = "space-between";
            citaDiv.style.padding = "10px";
            citaDiv.style.borderBottom = "1px solid #ddd";
    
            const especialidadDiv = document.createElement("div");
            especialidadDiv.textContent = cita.especialidad;
            citaDiv.appendChild(especialidadDiv);
    
            const fechaDiv = document.createElement("div");
            fechaDiv.textContent = cita.fecha;
            citaDiv.appendChild(fechaDiv);
    
            const horaDiv = document.createElement("div");
            horaDiv.textContent = cita.rangoHora;
            citaDiv.appendChild(horaDiv);
    
            contenedorResumen.appendChild(citaDiv);
        });
    
        // Crear el contenedor principal para el Swal
        const contenidoSwal = document.createElement("div");
contenidoSwal.style.fontSize = "16px";
contenidoSwal.style.marginBottom = "15px";

const mensaje = document.createElement("p");
mensaje.textContent = "Estás por reservar las siguientes citas:";
contenidoSwal.appendChild(mensaje);

const citasContainer = document.createElement("div");
citasContainer.style.border = "1px solid #ccc";
citasContainer.style.padding = "15px";
citasContainer.style.borderRadius = "5px";
citasContainer.style.backgroundColor = "#f9f9f9";

const encabezado = document.createElement("div");
encabezado.style.display = "flex";
encabezado.style.justifyContent = "space-around";
encabezado.style.fontWeight = "bold";
encabezado.style.paddingBottom = "10px";
encabezado.style.borderBottom = "2px solid #ccc";

const especialidadHeader = document.createElement("div");
especialidadHeader.textContent = "Especialidad";
encabezado.appendChild(especialidadHeader);

const fechaHeader = document.createElement("div");
fechaHeader.textContent = "Fecha";
encabezado.appendChild(fechaHeader);

const horaHeader = document.createElement("div");
horaHeader.textContent = "Hora";
encabezado.appendChild(horaHeader);

citasContainer.appendChild(encabezado);
citasContainer.appendChild(contenedorResumen);
contenidoSwal.appendChild(citasContainer);

// Crear un nuevo párrafo para la pregunta
const pregunta = document.createElement("p");
pregunta.textContent = "¿Deseas continuar?";
contenidoSwal.appendChild(pregunta);

Swal.fire({
    title: "¿Confirmar tus citas?",
    html: contenidoSwal,
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "No, cancelar",
    confirmButtonText: "Sí, confirmar",
    showDenyButton: true,
    denyButtonText: "Estoy decidiendo...",
    reverseButtons: true
}).then(result => {
            if (result.isConfirmed) {
                citasSeleccionadas.forEach(cita => {
                    const yaExiste = turnos.some(t =>
                        t.especialidad === cita.especialidad &&
                        t.fecha === cita.fecha &&
                        t.rangoHora === cita.rangoHora
                    );

                    if (!yaExiste) {
                        turnos.push({ ...cita, id: Date.now() + Math.random() });
                    }
                });

                localStorage.setItem("turnos", JSON.stringify(turnos));
                localStorage.setItem("estadoCitas", "confirmadas");

                citasSeleccionadas = [];
                especialidadesSeleccionadas = [];
                rangosHorasSeleccionados = [];

                localStorage.setItem("citasSeleccionadas", JSON.stringify(citasSeleccionadas));
                localStorage.setItem("especialidadesSeleccionadas", JSON.stringify(especialidadesSeleccionadas));
                localStorage.setItem("rangosHorasSeleccionados", JSON.stringify(rangosHorasSeleccionados));

                Swal.fire({
                    icon: "success",
                    title: "¡Citas confirmadas!",
                    text: "Tus citas fueron reservadas exitosamente.",
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                }).then(() => {
                    listaCitas.style.display = "none";
                    confirmacionCitas.style.display = "none";
                    listaCitasConfirmadas.style.display = "block";
                    document.getElementById("citas-confirmadas").style.display = "block";

                    formularioEspecialidad.style.display = "none";
                    mostrarCitasConfirmadas(turnos);
                });
            } else if (result.isDenied) {
                Swal.fire({
                    icon: "info",
                    title: "Decidiendo...",
                    text: "Tómate tu tiempo, no has confirmado aún.",
                });
            } else {
                citasSeleccionadas = [];
                especialidadesSeleccionadas = [];
                rangosHorasSeleccionados = [];
                localStorage.setItem("citasSeleccionadas", JSON.stringify(citasSeleccionadas));
                localStorage.setItem("especialidadesSeleccionadas", JSON.stringify(especialidadesSeleccionadas));
                localStorage.setItem("rangosHorasSeleccionados", JSON.stringify(rangosHorasSeleccionados));
                mostrarCitasSeleccionadas();
                resetearEspecialidades();
                Swal.fire({
                    icon: "info",
                    title: "Citas descartadas",
                    text: "No se ha reservado ninguna cita.",
                });
            }
        });
    });

    function mostrarCitasConfirmadas(citas) {
        while (listaCitasConfirmadas.firstChild) {
            listaCitasConfirmadas.removeChild(listaCitasConfirmadas.firstChild);
        }

        if (Array.isArray(citas)) {
            const contenedorCitas = document.createElement("div");
            contenedorCitas.classList.add("citas-recuadro");
            if (!citas.length) return;
            citas.forEach(cita => {
                const li = document.createElement("li");

                const especialidadSpan = document.createElement("span");
                especialidadSpan.textContent = cita.especialidad;
                li.appendChild(especialidadSpan);

                const fechaSpan = document.createElement("span");
                fechaSpan.textContent = cita.fecha;
                li.appendChild(fechaSpan);

                const horaSpan = document.createElement("span");
                horaSpan.textContent = cita.rangoHora;
                li.appendChild(horaSpan);

                contenedorCitas.appendChild(li);
            });

            listaCitasConfirmadas.appendChild(contenedorCitas);
        }

        const botonRegresar = document.createElement("button");
        botonRegresar.textContent = "¡Ya asistí a mi(s) cita(s)!";
        botonRegresar.classList.add("btn", "btn-primary");
        botonRegresar.addEventListener("click", reiniciarFormulario);
        listaCitasConfirmadas.appendChild(botonRegresar);
    }

    function reiniciarFormulario() {
        citasSeleccionadas = [];
        especialidadesSeleccionadas = [];
        rangosHorasSeleccionados = [];
        turnos = [];

        while (listaCitasConfirmadas.firstChild) {
            listaCitasConfirmadas.removeChild(listaCitasConfirmadas.firstChild);
        }

        localStorage.removeItem("turnos");
        localStorage.removeItem("citasSeleccionadas");
        localStorage.removeItem("especialidadesSeleccionadas");
        localStorage.removeItem("rangosHorasSeleccionados");
        localStorage.removeItem("especialidadSeleccionada");
        localStorage.removeItem("fechaSeleccionada");
        localStorage.removeItem("horaSeleccionada");
        localStorage.removeItem("estadoCitas");

        formularioEspecialidad.style.display = "block";
        formularioTurno.style.display = "none";
        listaCitas.style.display = "block";
        listaCitasConfirmadas.style.display = "none";
        confirmacionCitas.style.display = "none";
        document.getElementById("citas-confirmadas").style.display = "none";

        selectEspecialidad.querySelectorAll("option").forEach(option => {
            option.disabled = false;
        });
        selectEspecialidad.value = "";
        document.getElementById("dia").value = "";
        while (selectHora.firstChild) {
            selectHora.removeChild(selectHora.firstChild);
        }

        Swal.fire({
            icon: "success",
            title: "¡Gracias por cuidar tu salud! 💙",
            text: "Te esperamos cuando necesites otro turno.",
            timer: 1500,
            showConfirmButton: false,
            showClass: {
                popup: "animate__animated animate__fadeInDown"
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp"
            }
        });
    }

    function resetearEspecialidades() {
        selectEspecialidad.querySelectorAll("option").forEach(option => {
            option.disabled = false;
        });
    }
});
