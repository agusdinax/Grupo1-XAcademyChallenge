describe("Shady Meadows - Formulario de Contacto", () => {
  //TC-21 Verifica envio correcto, tanto en el frontend
  //como en la respuesta de la API
  it("21. Envio correcto", () => {
    cy.intercept("POST", "/api/message").as("contactSuccess");
    cy.visit("https://automationintesting.online");
    cy.get('[data-testid="ContactName"]').type("Juan Pérez");
    cy.get('[data-testid="ContactEmail"]').type("juan_perez@prueba.com");
    cy.get('[data-testid="ContactPhone"]').type("35133221231");
    cy.get('[data-testid="ContactSubject"]').type("Pregunta sobre reserva");
    cy.get('[data-testid="ContactDescription"]').type(
      "Quería preguntarles si está confirmada la reserva que realicé el día 16/6/2026 con esta misma dirección de email.",
    );
    cy.get(".d-grid > .btn").click();
    cy.get(".col-lg-8 > .card > .card-body > .h4").should(
      "contain",
      "Thanks for getting in touch Juan Pérez!",
    );

    cy.wait("@contactSuccess").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  //TC-22 Verifica si el backend rechaza correctamente
  //un formulario de contacto con el campo Name vacío
  it("22. Nombre vacío", () => {
    cy.intercept("POST", "/api/message").as("contactFail");
    cy.visit("https://automationintesting.online");
    cy.get('[data-testid="ContactEmail"]').type("juan_perez@prueba.com");
    cy.get('[data-testid="ContactPhone"]').type("35133221231");
    cy.get('[data-testid="ContactSubject"]').type("Pregunta sobre reserva");
    cy.get('[data-testid="ContactDescription"]').type(
      "Quería preguntarles si está confirmada la reserva que realicé el día 16/6/2026 con esta misma dirección de email.",
    );
    cy.get(".d-grid > .btn").click();
    cy.get(".alert > p").should("contain", "Name may not be blank");

    cy.wait("@contactFail").then((interception) => {
      expect(interception.request.body.name).to.equal(""); //verifica que el campo Name esté vacío
      expect(interception.response.statusCode).to.equal(400);
      expect(interception.response.body[0]).to.equal("Name may not be blank");
    });
  });
});
