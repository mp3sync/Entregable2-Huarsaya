// Datos de especialidades y doctores
const especialidades = [
    { nombre: "Cardiología", doctor: "Dr. Pérez" },
    { nombre: "Pediatría", doctor: "Dra. Gómez" },
    { nombre: "Dermatología", doctor: "Dr. Ramírez" },
    { nombre: "Oftalmología", doctor: "Dra. López" },
    { nombre: "Ginecología", doctor: "Dra. Huaman" }
  ];
  
  // Para que no se pierdan los turnos tomados - Localstore
  let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  
  // 1 - DOM
  const especialidadSelect = document.getElementById("especialidadSelect");
  const formTurnos = document.getElementById("formTurnos");
  const listaTurnos = document.getElementById("listaTurnos");
  
  // Select
  function cargarEspecialidades() {
    especialidades.forEach((esp, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${esp.nombre} - ${esp.doctor}`;
      especialidadSelect.appendChild(option);
    });
  }
  
  // 2 - DOM
  function mostrarTurnos() {
    listaTurnos.innerHTML = ""; 
    if (turnos.length === 0) {
      listaTurnos.innerHTML = "<li class='list-group-item'>No hay turnos agendados.</li>";
      return;
    }
  
    turnos.forEach((turno, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${turno.especialidad} - ${turno.doctor}</span>
        <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${index})">Eliminar</button>
      `;
      listaTurnos.appendChild(li);
    });
  }
  
  // Para que agende el paciente
  formTurnos.addEventListener("submit", function (e) {
    e.preventDefault();
  
    const seleccion = especialidades[especialidadSelect.value];
    const nuevoTurno = {
      especialidad: seleccion.nombre,
      doctor: seleccion.doctor
    };
  
    turnos.push(nuevoTurno);
    localStorage.setItem("turnos", JSON.stringify(turnos));
  
    mostrarTurnos();
    formTurnos.reset();
  });
  
  // Cuando quiere eliminar un turno
  function eliminarTurno(index) {
    turnos.splice(index, 1);
    localStorage.setItem("turnos", JSON.stringify(turnos));
    mostrarTurnos();
  }
  
  cargarEspecialidades();
  mostrarTurnos();
  