// ¡Hola! Acá estaría la lista de especialidades y doctores disponibles para reservar una cita 
const especialidades = [
    { nombre: "Cardiología", doctor: "Dr. Pérez" },
    { nombre: "Pediatría", doctor: "Dra. Gómez" },
    { nombre: "Dermatología", doctor: "Dr. Ramírez" },
    { nombre: "Oftalmología", doctor: "Dra. López" }
];

function agendarTurno() {
    let mensaje = "Elija una especialidad:\n";
    especialidades.forEach((esp, index) => {
        mensaje += `${index + 1}. ${esp.nombre}\n`;
    });

    let opcion;
    do {
        let entrada = prompt(mensaje);
        if (entrada === null) {
            alert("Operación cancelada. Gracias por su visita.");
            return; 
        }
        opcion = parseInt(entrada);

        if (isNaN(opcion) || opcion < 1 || opcion > especialidades.length) {
            alert("Opción no válida. Intente nuevamente.");
        }
    } while (isNaN(opcion) || opcion < 1 || opcion > especialidades.length);

    let seleccion = especialidades[opcion - 1];
    alert(`Turno asignado con éxito en ${seleccion.nombre} con ${seleccion.doctor}. ¡Gracias!`);

    let otroTurno = confirm("¿Desea agendar otro turno?");
    if (otroTurno) agendarTurno();
}

agendarTurno();
