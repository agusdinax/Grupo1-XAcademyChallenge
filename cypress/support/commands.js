// Creamos un comando que recibe dos strings con formato día, mes y año
// y los escribe en los campos check-in y check-out.
Cypress.Commands.add('seleccionarFechas', (checkIn, checkOut) => {
 
  // Busca el label que se nombra "Check In", sube al elemento padre (.parent())
  // y dentro busca el primer input para limpiarlo y escribir la fecha que posteriormente se genera en el otro command
  cy.contains('label', 'Check In').parent().find('input').first().clear().type(checkIn)
 
  // Lo mismo ocurre para el label de "Check Out"
  cy.contains('label', 'Check Out').parent().find('input').clear().type(checkOut)
 
}) 
 
// Creamos un command que genera fechas de check-in y check-out de forma dinámica para evitar usar
// fechas hardcodeadas que pueden quedar en el pasado o ya estar reservadas, recibe dos parámetros:
// cantidadNoches: cuántas noches dura la estadia (por ej: 1, 2, 28)
// diasBase: desde cuántos días en el futuro empieza el rango de check-in (por defecto 30 días desde hoy)

Cypress.Commands.add('seleccionarFechasAleatorias', (cantidadNoches, diasBase = 30) => {
 
  const hoy = new Date() // crea un objeto de tipo Date con la fecha y hora actual del sistema en el momento en que se ejecuta el test.
 
  // Genera un número aleatorio entre diasBase y diasBase+30
  // esto evita que dos tests con el mismo diasBase elijan las mismas fechas
  const diasAleatorios =
    Math.floor(Math.random() * 30) + diasBase
 
  // Se crea una copia de la fecha actual y se la mueve hacia adelante una cantidad de días 
  // igual a diasAleatorios, obteniendo así la fecha del check-in.
  const checkIn = new Date(hoy)
  checkIn.setDate(hoy.getDate() + diasAleatorios)
 
  // Se crea una copia de la fecha de check-in y se le suman cantidadNoches días 
  // para obtener la fecha del check-out.
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkIn.getDate() + cantidadNoches)
 
  // Función La función toma una fecha, extrae día, mes y año, y asegura que día y mes 
  // tengan siempre 2 dígitos para poder formatear la fecha correctamente.
  const formatearFecha = (fecha) => {
    const dia = String(fecha.getDate()).padStart(2, '0')        
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')  
    const anio = fecha.getFullYear()
 
    return `${dia}/${mes}/${anio}` //Construye y devuelve una fecha en formato día-mes-año usando los valores de día, mes y año obtenidos.
  }
  //Convierte las fechas checkIn y checkOut en cadenas con formato dd/mm/yyyy 
  //y las guarda en fechaIngreso y fechaSalida para poder utilizarlas en el formulario o en el test.
  const fechaIngreso = formatearFecha(checkIn)
  const fechaSalida = formatearFecha(checkOut)
 
  // cy.log() muestra el valor en el panel de Cypress (sirve para depurar que valores está utilizando el test)
  cy.log(`CheckIn: ${fechaIngreso}`)
  cy.log(`CheckOut: ${fechaSalida}`)
 
  // Llama al comando anterior para escribir las fechas en el formulario
  cy.seleccionarFechas(fechaIngreso, fechaSalida)
 
})
 
 
// Creamos un Command que hace clic en el botón de la primera habitación disponible 
// que aparezca en los resultados de búsqueda.
Cypress.Commands.add('seleccionarHabitacionDisponible', () => {
 
  // Selecciona todos los botones de reserva dentro de las tarjetas de habitación
  // verifica que hay al menos una habitación disponible toma solo la primera 
  // y hace clic en ella
  cy.get('.room-card a.btn.btn-primary')
    .should('have.length.greaterThan', 0)
    .first()
    .click()
 
})
 
 
// Creamos un command que recibe un objeto con los datos del huésped y los escribe en cada campo
// del formulario de reserva, recibe el parámetro "datos": que es un objeto con propiedades nombre, 
// apellido, email, telefono (ver archivo fixtures/huespedes.json)

Cypress.Commands.add('completarFormularioReserva', (datos) => {
  // Selecciona cada input por su atributo "name"
 if (datos.nombre !== '') {
    cy.get('input[name="firstname"]').clear().type(datos.nombre)
  }

  if (datos.apellido !== '') {
    cy.get('input[name="lastname"]').clear().type(datos.apellido)
  }

    if (datos.email || datos.correo) {
    cy.get('input[name="email"]')
      .clear()
      .type(datos.email ?? datos.correo)
  }

  if (datos.telefono !== '') {
    cy.get('input[name="phone"]').clear().type(datos.telefono)
  }           // teléfono
 
})
 
 
// Creamos un command que verifica a traves del h2 que la reserva fue procesada 
// y que la confirmación se muestra al usuario. 
Cypress.Commands.add('validarReservaExitosa', () => {
  cy.contains('h2', 'Booking Confirmed')
    .should('be.visible')
}) 

Cypress.Commands.add(
  "completarFormularioContacto",
  ({ name = "", email = "", phone = "", subject = "", message = "" }) => {
    if (name) {
      cy.get('[data-testid="ContactName"]').type(name);
    }

    if (email) {
      cy.get('[data-testid="ContactEmail"]').type(email);
    }

    if (phone) {
      cy.get('[data-testid="ContactPhone"]').type(phone);
    }

    if (subject) {
      cy.get('[data-testid="ContactSubject"]').type(subject);
    }

    if (message) {
      cy.get('[data-testid="ContactDescription"]').type(message);
    }
  },
);

Cypress.Commands.add('enviarFormularioReserva', () => {
  cy.contains('Reserve Now').should('be.visible').and('be.enabled').click()
})

Cypress.Commands.add('deberiaMostrarError', (mensaje) => {
  cy.get('.alert-danger, .error, [class*="error"], [class*="alert"]')
    .should('be.visible')
    .and('contain.text', mensaje)
})

Cypress.Commands.add('noDeberiaConfirmarReserva', () => {
  cy.contains('Reservation Successful').should('not.exist')
})