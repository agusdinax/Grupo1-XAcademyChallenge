describe ('Browse valid functions as Admin' , ()=>{

    const baseUrl = 'https://automationintesting.online/admin';
    

    // Manejo de excepciones para evitar que fallos de hidratación de React detengan las pruebas
    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('Minified React error #418') || err.message.includes('Hydration failed')) {
        return false;
        }
        return true;
    });
    ////////////////////////////////////////////////////////////////////////////////////////////
    
    beforeEach(()=>{
        cy.visit(baseUrl)
        cy.loginAdmin('admin', 'password') // Llamada al comando personalizado para iniciar sesión antes de cada prueba
        
        // Verificamos la URL para asegurarse de que se ha redirigido correctamente al panel
        cy.url().should('include', '/admin/rooms')
    })
    
    it('CP-030: Acceso a reservas', () => {
      // El listado de habitaciones/reservas está en la vista principal del Panel Admin (Rooms)
      // Comprobamos que el panel de creación/visualización está presente
      cy.contains('Rooms').should('be.visible')
      cy.get('[data-testid="roomName"]').should('be.visible')
    })
 
    it('CP-031: Visualización de clientes (Mensajes)', () => {
      // Navegamos a la bandeja de mensajes usando el ícono correspondiente en la navbar
      cy.get('.navbar').contains('Messages').click()
      
      // Comprobamos que el contenedor de mensajes carga correctamente
      cy.contains('Messages').should('be.visible')
      cy.get('.badge').should('exist') // Contenedor del contador de mensajes
    });

    it.only('CP-032: Logout', () => {
      cy.contains('Logout').click()
      
      // Tras el logout, el administrador debe ver la página principal
      //cy.get('[id="username"]').should('be.visible')
      cy.contains('Shady Meadows B&B').should('be.visible')
      cy.get('navbar').should('not.exist')
    })
    
})

