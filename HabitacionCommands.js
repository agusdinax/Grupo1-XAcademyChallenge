Cypress.Commands.add('eligeHabitacion'), () => {
    // Selecciona la habitacion
    cy.contains('.nav-link', 'Rooms').click()
    // Busca el botón "Book now" únicamente dentro de la primera tarjeta de habitación
    cy.get('.room-card').first().contains('Book now').click()
}

Cypress.Commands.add('verFormularioReserva'), () => {
    //Selecciona el boton "Reserve now"
    cy.get('button').contains('Reserve now').click()
    // Verifica que el formulario de reserva esté visible
    cy.get('form').should('be.visible')
}

Cypress.Commands.add('navegarEntreHabitaciones'), () => {
    //Baja hasta la sección de habitaciones
    cy.get('a[href="/#rooms"]').scrollIntoView()
    // Selecciona una habitacion diferente
    cy.get('.room-container').eq(0).contains('View Details').click()
    //Visualizar la informacion de la habitacion seleccionada
    cy.get('.room-description').should('be.visible')
}