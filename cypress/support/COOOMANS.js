Cypress.Commands.add('abrirFormularioReserva', () => {
  cy.visit('https://automationintesting.online/')
})

Cypress.Commands.add('completarFormularioReserva', (datos = {}) => {
  const { nombre, apellido, correo, telefono } = datos
  if (nombre !== undefined) {
    cy.get('[name="firstname"], input[placeholder="Firstname"]')
      .first()
      .clear()
      .type(nombre || ' ')
      .blur()
  }
  if (apellido !== undefined) {
    cy.get('[name="lastname"], input[placeholder="Lastname"]')
      .first()
      .clear()
      .type(apellido || ' ')
      .blur()
  }
  if (correo !== undefined) {
    cy.get('[name="email"], input[placeholder="Email"]')
      .first()
      .clear()
      .type(correo || ' ')
      .blur()
  }
  if (telefono !== undefined) {
    cy.get('[name="phone"], input[placeholder="Phone"]')
      .first()
      .clear()
      .type(telefono || ' ')
      .blur()
  }
})

Cypress.Commands.add('enviarFormularioReserva', () => {
  cy.get('button').contains(/book/i).click()
})

Cypress.Commands.add('deberiaMostrarError', (mensaje) => {
  cy.get('.alert-danger, .error, [class*="error"], [class*="alert"]')
    .should('be.visible')
    .and('contain.text', mensaje)
})

Cypress.Commands.add('noDeberiaConfirmarReserva', () => {
  cy.get('.confirmation, [class*="confirm"], [class*="success"]')
    .should('not.exist')
})