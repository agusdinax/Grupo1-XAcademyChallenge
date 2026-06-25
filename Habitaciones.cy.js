// habitacioones.cy.js

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