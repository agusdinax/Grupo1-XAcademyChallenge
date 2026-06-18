describe("Shady Meadows - Formulario de Contacto", () => {
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
});
