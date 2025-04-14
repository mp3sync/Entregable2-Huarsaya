# Proyecto Final: Simulador interactivo de citas médicas

## Descripción
Este proyecto es un simulador interactivo para reservar turnos médicos en la Clínica Vida Zen. Permite a los usuarios seleccionar una especialidad, fecha y hora para reservar un turno.

## ¿Cómo funciona?

1. Las especialidades se cargan desde un archivo data.json.
2. El usuario selecciona una especialidad médica desde un listado.
3. El usuario elige una fecha disponible desde el calendario y una hora desde un formulario.
4. El sistema valida que:
    - La fecha seleccionada no esté pasada.
    - El horario elegido no esté ocupado por otro turno.
5. El usuario puede agregar, ver y eliminar turnos.
6. Al confirmar, los turnos se guardan en localStorage y se muestran como confirmados en la página.

## Instrucciones de Uso
1. Abre el archivo `especialidades.html` en un navegador web.
2. Selecciona una especialidad médica desde el listado.
3. Escoge una fecha disponible y un horario para tu cita.
4. Haz clic en "Reservar Turno", lo que agregará el turno seleccionado a la lista de citas.
5. Cuando estés listo, haz clic en el botón "Confirmar Citas" para completar la reserva.
6. Los turnos reservados se mostrarán en la parte inferior de la página. Puedes eliminarlos si lo deseas.

## Herramientas utilizadas
- HTML5
- CSS3 + Bootstrap + Animate.css
- JavaScript (DOM, Eventos, Fetch, localStorage)
- SweetAlert2
