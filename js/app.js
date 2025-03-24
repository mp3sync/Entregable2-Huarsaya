class TurnosApp {
  constructor() {
    this.turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    this.especialidades = [
      "Cardiología",
      "Dermatología",
      "Pediatría",
      "Traumatología",
      "Ginecología",
      "Medicina General",
      "Oftalmología",
    ];
    this.cacheDOM();
    this.bindEvents();
    this.cargarEspecialidades();
    this.mostrarTurnos();
  }

  cacheDOM() {
    this.form = document.getElementById('formTurno');
    this.selectEspecialidades = document.getElementById('especialidades');
    this.inputDia = document.getElementById('dia');
    this.selectHora = document.getElementById('hora');
    this.contenedorTurnos = document.getElementById('listaTurnos');
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.agregarTurno();
    });
  }

  limpiarElemento(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  cargarEspecialidades() {
    this.limpiarElemento(this.selectEspecialidades);

    const opciones = ["Selecciona una opción", ...this.especialidades].map(especialidad => {
      const option = document.createElement('option');
      option.value = especialidad === "Selecciona una opción" ? '' : especialidad;
      option.textContent = especialidad;
      return option;
    });

    opciones.forEach(option => this.selectEspecialidades.appendChild(option));
  }

  agregarTurno() {
    const especialidadSeleccionada = this.selectEspecialidades.value;
    const dia = this.inputDia.value;
    const hora = this.selectHora.value;
    const hoy = new Date().toISOString().split("T")[0];

    if (!especialidadSeleccionada || !dia || !hora) {
      return this.mostrarError('Todos los campos son obligatorios.');
    }
    if (dia < hoy) {
      return this.mostrarError('No puedes seleccionar una fecha pasada.');
    }

    const nuevoTurno = { especialidad: especialidadSeleccionada, dia, hora };
    this.turnos.push(nuevoTurno);
    localStorage.setItem('turnos', JSON.stringify(this.turnos));

    this.mostrarTurnos();
    this.form.reset();
  }

  mostrarError(mensaje) {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = mensaje;
    errorMsg.style.color = 'red';
    errorMsg.style.fontWeight = 'bold';
    this.form.appendChild(errorMsg);
    setTimeout(() => errorMsg.remove(), 3000);
  }

  mostrarTurnos() {
    this.limpiarElemento(this.contenedorTurnos);

    if (this.turnos.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.textContent = 'No hay turnos asignados.';
      this.contenedorTurnos.appendChild(mensaje);
      return;
    }

    this.turnos.forEach((turno, index) => {
      const divTurno = document.createElement('div');
      divTurno.classList.add('turno');

      const pEspecialidad = document.createElement('p');
      pEspecialidad.textContent = `Especialidad: ${turno.especialidad}`;

      const pDia = document.createElement('p');
      pDia.textContent = `Día: ${turno.dia}`;

      const pHora = document.createElement('p');
      pHora.textContent = `Hora: ${turno.hora}`;

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.addEventListener('click', () => this.eliminarTurno(turno));

      [pEspecialidad, pDia, pHora, btnEliminar].forEach(el => divTurno.appendChild(el));
      this.contenedorTurnos.appendChild(divTurno);
    });
  }

  eliminarTurno(turnoAEliminar) {
    this.turnos = this.turnos.filter(turno => turno !== turnoAEliminar);
    this.guardarTurnos();
    this.mostrarTurnos();
  }
}

document.addEventListener('DOMContentLoaded', () => new TurnosApp());
