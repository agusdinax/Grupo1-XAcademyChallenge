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

describe('3.2 Validaciones del Formulario de Reserva', () => {
  const datosValidos = {
    nombre: 'Juan',
    apellido: 'Perez',
    correo: 'juan_perez@prueba.com',
    telefono: '35133221231',
  }

   beforeEach(function () {
    cy.viewport(1280, 720)
    cy.visit('https://automationintesting.online/')
    cy.seleccionarFechasAleatorias(28, 150)
    cy.fixture('datosReserva').then((datos) => {
      this.datosReserva = datos.datosReserva
      this.mensajesError = datos.mensajesError
    })
    cy.contains('Check Availability').should('be.visible').click()
    cy.seleccionarHabitacionDisponible()
    cy.url().should('include', '/reservation/')
    cy.contains('Reserve Now').should('be.visible').click()
  })

  it('CP-013 | Nombre vacío - debe mostrar error Firstname should not be blank', function () {
      cy.completarFormularioReserva(
        this.datosReserva.nombreVacio
      )
      cy.enviarFormularioReserva()
      cy.deberiaMostrarError(this.mensajesError.nombreVacio)
      cy.noDeberiaConfirmarReserva()
    })

  it('CP-014 | Apellido vacío - debe mostrar error Lastname should not be blank', function ()  {
     cy.completarFormularioReserva(
        this.datosReserva.apellidoVacio
      )
    cy.enviarFormularioReserva()
    cy.deberiaMostrarError(this.mensajesError.apellidoVacio)
    cy.noDeberiaConfirmarReserva()
  })

  it('CP-015 | Email vacío - debe mostrar error must not be empty', function ()  {
      cy.completarFormularioReserva(
        this.datosReserva.correoVacio
      )
    cy.enviarFormularioReserva()
    cy.deberiaMostrarError(this.mensajesError.correoVacio)
    cy.noDeberiaConfirmarReserva()
  })

  it('CP-016 | Teléfono vacío - debe mostrar error must not be empty', function () {
    cy.completarFormularioReserva(
        this.datosReserva.telefonoVacio
      )
    cy.enviarFormularioReserva()
    cy.deberiaMostrarError(this.mensajesError.telefonoVacio)
    cy.noDeberiaConfirmarReserva()
  })

  it('CP-015b | Email mal formado - debe mostrar error must be a well-formed email address', function ()  {
    cy.completarFormularioReserva(
        this.datosReserva.correoInvalido
      )
    cy.enviarFormularioReserva()
    cy.deberiaMostrarError(this.mensajesError.correoInvalido)
    cy.noDeberiaConfirmarReserva()
  })

  it('CP-018 | Nombre con 1 carácter - debe mostrar error size must be between 3 and 18', () => {
    cy.completarFormularioReserva({
      nombre: 'J',
      apellido: datosValidos.apellido,
      correo: datosValidos.correo,
      telefono: datosValidos.telefono,
    })
    cy.enviarFormularioReserva()
    cy.deberiaMostrarError('size must be between 3 and 18')
    cy.noDeberiaConfirmarReserva()
  })

  it('CP-019 | Email con longitud excesiva - debe mostrar error must be a well-formed email address', () => {
    const correoLargo = `juan_perez${'s'.repeat(60)}@prueba.com`
    cy.completarFormularioReserva({
      nombre: datosValidos.nombre,
      apellido: datosValidos.apellido,
      correo: correoLargo,
      telefono: datosValidos.telefono,
    })
    cy.enviarFormularioReserva()
    cy.deberiaMostrarError('must be a well-formed email address')
    cy.noDeberiaConfirmarReserva()
  })

  it('CP-020 | Formulario vacío - deben aparecer todos los mensajes de error', () => {
    cy.enviarFormularioReserva()
    cy.get('.alert-danger, .error, [class*="error"], [class*="alert"]')
      .should('be.visible')
    cy.get('body')
      .should('contain.text', 'should not be blank')
      .and('contain.text', 'must not be empty')
    cy.noDeberiaConfirmarReserva()
  })
})

describe("Shady Meadows - Formulario de Contacto", () => {
  let contacto; //Variable que contendrá los datos de contacto del fixture
  beforeEach(() => {
    cy.visit("https://automationintesting.online");
    cy.fixture("contacto").then((datos) => {
      contacto = datos;
    });
  });

  //TC-21 Verifica envio correcto, tanto en el frontend
  //como en la respuesta de la API
  it("21. Envio correcto", () => {
    cy.intercept("POST", "/api/message").as("contactSuccess");

    cy.completarFormularioContacto(contacto);

    cy.get(".d-grid > .btn").click();
    cy.get(".col-lg-8 > .card > .card-body > .h4").should(
      "contain",
      "Thanks for getting in touch Juan Pérez!",
    );

    cy.wait("@contactSuccess").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  //TC-22 Verifica si tanto el frontend como el backend
  //rechaza correctamente un formulario de contacto con el campo Name vacío
  it("22. Nombre vacío", () => {
    cy.intercept("POST", "/api/message").as("contactFail");

    cy.completarFormularioContacto({ ...contacto, name: "" });

    cy.get(".d-grid > .btn").click();
    cy.get(".alert > p").should("contain", "Name may not be blank");

    cy.wait("@contactFail").then((interception) => {
      expect(interception.request.body.name).to.equal(""); //verifica que el campo Name esté vacío
      expect(interception.response.statusCode).to.equal(400);
      expect(interception.response.body[0]).to.equal("Name may not be blank");
    });
  });

  //TC-23 Verifica si el backend rechaza correctamente
  //un formulario de contacto con un Email inválido
  it("23. Email inválido", () => {
    cy.intercept("POST", "/api/message").as("contactFail");

    cy.completarFormularioContacto({ ...contacto, email: "juan_perez" });

    cy.get(".d-grid > .btn").click();
    cy.get(".alert > p").should(
      "contain",
      "must be a well-formed email address",
    );

    cy.wait("@contactFail").then((interception) => {
      expect(interception.request.body.email).to.equal("juan_perez");
      expect(interception.response.statusCode).to.equal(400);
      expect(interception.response.body[0]).to.equal(
        "must be a well-formed email address",
      );
    });
  });

  //TC-24 Verifica si el backend rechaza correctamente
  //un formulario de contacto con el campo Message vacío
  it("24. Mensaje vacío", () => {
    cy.intercept("POST", "/api/message").as("contactFail");

    cy.completarFormularioContacto({ ...contacto, message: "" });

    cy.get(".d-grid > .btn").click();

    cy.get(".alert > p").should(
      "contain",
      "Message may not be blank",
      "Message must be between 20 and 2000 characters.",
    );

    cy.wait("@contactFail").then((interception) => {
      expect(interception.request.body.description).to.equal("");
      expect(interception.response.statusCode).to.equal(400);
      expect(interception.response.body).to.contain("Message may not be blank");
    });
  });

  //TC-25 Verifica si el backend rechaza correctamente
  //un mensaje que supera la longitud máxima permitida
  it("25. Mensaje de longitud máxima", () => {
    cy.intercept("POST", "/api/message").as("contactFail");

    const mensajeLargo = "A".repeat(2001);

    cy.completarFormularioContacto({ ...contacto, message: mensajeLargo });

    cy.get(".d-grid > .btn").click();

    cy.get(".alert > p").should(
      "contain",
      "Message must be between 20 and 2000 characters.",
    );

    cy.wait("@contactFail").then((interception) => {
      expect(interception.request.body.description.length).to.equal(2001);
      expect(interception.response.statusCode).to.equal(400);
      expect(interception.response.body[0]).to.equal(
        "Message must be between 20 and 2000 characters.",
      );
    });
  });

  //TC-26 Verifica si frontend y backend procesan
  //correctamente caracteres especiales en Message
  it("26. Caracteres especiales", () => {
    cy.intercept("POST", "/api/message").as("contactSuccess");

    const mensajeEspecial =
      "¡Hola! ¿Cómo estás? @#$%^&*()_+-=[]{}|;:',.<>/?~` ñ Ñ áéíóú";

    cy.completarFormularioContacto({ ...contacto, message: mensajeEspecial });

    cy.get(".d-grid > .btn").click();

    cy.get(".col-lg-8 > .card > .card-body > .h4").should(
      "contain",
      "Thanks for getting in touch Juan Pérez!",
    );

    cy.wait("@contactSuccess").then((interception) => {
      expect(interception.request.body.description).to.equal(mensajeEspecial);
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});

describe('Habitaciones - Shady Meadows B&B', () => {
        //ingrersa al sitio web
    beforeEach(()=>{
        cy.visit('https://automationintesting.online//')
    })

    it('Ver formulario de reserva', () => {
        // Selecciona la habitacion
        // Busca el botón "Book now" dentro de la tarjeta de habitación
        cy.eligeHabitacion()
        //Selecciona el boton "Reserve now"
        // Verifica que el formulario de reserva esté visible
        cy.verFormularioReserva()
    
    })

    it('Navegar entre habitaciones', () => {
        // Selecciona la habitacion
        // Busca el botón "Book now" dentro de la tarjeta de habitación
        cy.eligeHabitacion()
        //Baja hasta la sección de habitaciones
        // Selecciona una habitacion diferente 
        //Visualizar la informacion de la habitacion seleccionada
        cy.navegarEntreHabitaciones()

    })
})