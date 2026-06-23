describe ('Login Admin automationTesting.online' , ()=>{

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
        // cy.loginAdmin('user', 'pass')
        
    })
    
    it('CP-027: Login with valid credentials', ()=>{

        cy.loginAdmin('admin', 'password') // Llamada al comando personalizado para iniciar sesión antes de cada prueba

        // Verificamos la URL para asegurarse de que se ha redirigido correctamente al panel
        cy.url().should('include', '/admin/rooms')
    })

    it('CP-028: Login with invalid credentials (userInvalid)', ()=>{
        cy.loginAdmin('invalidUser', 'password') 

        //Verificamos que el mensaje de error sea visible
        cy.get('.alert').should('be.visible').and('have.text','Invalid credentials')

    })

    it('CP-029: Login with invalid credentials (invalidPassword)', ()=>{
        cy.loginAdmin('admin', 'invalidPassword') 

        //Verificamos que el mensaje de error sea visible
        cy.get('.alert').should('be.visible').and('have.text','Invalid credentials')

    })
})




