// describe(), aquí se agrupan los tests que se relacionan entre sí, lo que se encuentra es solo un string que 
// aparece en Cypress para identificar el bloque.
describe('Reservas - Usuario Invitado', () => { 
 
  // beforeEach() se ejecuta antes de cada it(). De esta manera cada test arranca con el mismo 
  // estado inicial sin importar el orden en que se ejecuten.
  beforeEach(() => {
    cy.viewport(1280, 720) // Establece un tamaño de pantalla
    cy.visit('https://automationintesting.online/') // Navega a la URL de la web antes de cada test
    cy.fixture('huespedes').as('huespedes') // Carga el archivo fixtures/huespedes.json y lo guarda con el alias huespedes.
  })

  // Usa  una función function() para poder acceder a this.huespedes
  it('CP-007 Realizar una reserva con datos válidos', function () {
 
    // cy.intercept() escucha la petición HTTP antes de que ocurra. 
    // El alias @crearReserva nos permite llamarla más adelante con un cy.wait()
    cy.intercept('POST', '**/api/booking').as('crearReserva') 

    // Comando agregado que calcula fechas aleatorias, en este caso selecciona estadia de 2 noches, a partir de 10 días desde hoy.
    cy.seleccionarFechasAleatorias(2, 10)
 
    // Verifica que el botón existe y es visible antes de hacer clic
    cy.contains('Check Availability').should('be.visible').click()
 
    // Comando agregado que hace clic en la primera habitación disponible que encuentre
    cy.seleccionarHabitacionDisponible()
 
    // Verifica que la URL cambió, lo que confirma que el flujo continua corriendo correctamente.
    cy.url().should('include', '/reservation/')
 
    // Verifica que el botón Reserve Now existe, es visible y hace clic, luego el usuario 
    // es redirigido al formulario de datos del huesped
    cy.contains('Reserve Now').should('be.visible').click()  
 
    // Espera a que el primer campo del formulario sea visible antes de seguir con la carga de datos
    cy.get('input[name="firstname"]').should('be.visible')
 
    // Comando agregado que completa todos los campos del formulario con los datos del huesped_1
    // this.huespedes funciona gracias al alias definido en el beforeEach con cy.fixture()
    cy.completarFormularioReserva(
      this.huespedes.huesped_1
    )
 
    // segundo clic en "Reserve Now", nuevamente verifica que el botón sea visible, que esté habilitado 
    // y realiza clic en el mismo enviando el formulario y creando la reserva
    cy.contains('Reserve Now').should('be.visible').and('be.enabled').click()
 
    // valida que la petición para crear una reserva se haya ejecutado correctamente 
    // y que el servidor haya respondido con el código esperado.
    cy.wait('@crearReserva').its('response.statusCode').should('eq', 201)
 
    // Comando agregado que verifica que la reserva fue exitosa en pantalla-
    cy.validarReservaExitosa()
 
  })
  
  
  it('CP-008 Realizar dos reservas consecutivas con datos válidos', function () {
 
    // intercepta las peticiónes HTTP, las identifique y les asigne un nombre para poder usarla después en el test.
    // una para ambas reservas
    cy.intercept('POST', '**/api/booking').as('crearReserva')
 
    // Reserva 1 ─
 
    // Comando agregado que en este caso selecciona una fecha de check-in aleatoria a partir de 30 días desde hoy
    // y una fecha de check-out 2 noches después.
    cy.seleccionarFechasAleatorias(2, 30)
 
    cy.contains('Check Availability').should('be.visible').click()
 
    cy.seleccionarHabitacionDisponible()
 
    cy.url().should('include', '/reservation/')
 
    cy.contains('Reserve Now').should('be.visible').click()
 
    cy.get('input[name="firstname"]').should('be.visible')
 
    // Aquí se usa nuevamente el comando agregado para completar los datos del huesped, en este caso usa los datos de huesped_1
    cy.completarFormularioReserva(
      this.huespedes.huesped_1
    )
 
    cy.contains('Reserve Now').should('be.visible').and('be.enabled').click()
 
    // Espera la respuesta de la primer reserva y verifica el status del endpoint
    cy.wait('@crearReserva').its('response.statusCode').should('eq', 201)
 
    cy.validarReservaExitosa()
 
    // Verifica que el botón Return home sea visible y realiza clic para volver
    // a la página principal y así iniciar la segunda reserva
    cy.contains('Return home').should('be.visible').click()
 
    // Reserva 2 ─
 
    // Comando agregado que en este caso selecciona una fecha de check-in aleatoria a partir de 60 días desde hoy
    // y una fecha de check-out 2 noches después, las fechas son distintas a las de la Reserva 1 para evitar solapamiento
    cy.seleccionarFechasAleatorias(2, 90)
 
    cy.contains('Check Availability').should('be.visible').click()
 
    cy.seleccionarHabitacionDisponible()
 
    cy.url().should('include', '/reservation/')
 
    cy.contains('Reserve Now').should('be.visible').click()
 
    cy.get('input[name="firstname"]').should('be.visible')
 
    // Se completan los campos del formulario utilizando los datos de huesped_2
    cy.completarFormularioReserva(
      this.huespedes.huesped_2
    )
 
    cy.contains('Reserve Now').should('be.visible').and('be.enabled').click()
 
    // Espera la respuesta de la segunda reserva
    cy.wait('@crearReserva').its('response.statusCode').should('eq', 201)
 
    cy.validarReservaExitosa()
 
  })
 

  it('CP-009 Reserva de estadía de una sola noche (mínimo de fechas)', function () {
 
    cy.intercept('POST', '**/api/booking').as('crearReserva')
 
    // Se utiliza el Comando agregado para seleccionar una fecha de check-in aleatoria a 90 días desde hoy
    // y una fecha de check-out 1 noche después.
    cy.seleccionarFechasAleatorias(1, 90)
 
    cy.contains('Check Availability').should('be.visible').click()
 
    cy.seleccionarHabitacionDisponible()
 
    cy.url().should('include', '/reservation/')
 
    cy.contains('Reserve Now').should('be.visible').click()
 
    cy.get('input[name="firstname"]').should('be.visible')
 
    cy.completarFormularioReserva(
      this.huespedes.huesped_1
    )
 
    cy.contains('Reserve Now').should('be.visible').and('be.enabled').click()
 
    cy.wait('@crearReserva').its('response.statusCode').should('eq', 201)
 
    cy.validarReservaExitosa()
 
  })
 

  it('CP-010 Reserva de estadía larga', function () {
 
    cy.intercept('POST', '**/api/booking').as('crearReserva')
 
    // Se utiliza el Comando agregado para seleccionar una fecha de check-in aleatoria a 150 días desde hoy
    // y una fecha de check-out 28 noches después.
    cy.seleccionarFechasAleatorias(28, 150)
 
    cy.contains('Check Availability').should('be.visible').click()
 
    cy.seleccionarHabitacionDisponible()
 
    cy.url().should('include', '/reservation/')
 
    cy.contains('Reserve Now').should('be.visible').click()
 
    cy.get('input[name="firstname"]').should('be.visible')
 
    cy.completarFormularioReserva(
      this.huespedes.huesped_1
    )
 
    cy.contains('Reserve Now').should('be.visible').and('be.enabled').click()
 
    cy.wait('@crearReserva').its('response.statusCode').should('eq', 201)
 
    cy.validarReservaExitosa()
 
  })
 
})