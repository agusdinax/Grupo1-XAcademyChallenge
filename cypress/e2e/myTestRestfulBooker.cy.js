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

  //TC-22 Verifica si tanto el frontend como el backend
  //rechaza correctamente un formulario de contacto con el campo Name vacío
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

  //TC-23 Verifica si el backend rechaza correctamente
  //un formulario de contacto con un Email inválido
  it("23. Email inválido", () => {
    cy.intercept("POST", "/api/message").as("contactFail");

    cy.visit("https://automationintesting.online");

    cy.get('[data-testid="ContactName"]').type("Juan Pérez");
    cy.get('[data-testid="ContactEmail"]').type("juan_perez");
    cy.get('[data-testid="ContactPhone"]').type("35133221231");
    cy.get('[data-testid="ContactSubject"]').type("Pregunta sobre reserva");
    cy.get('[data-testid="ContactDescription"]').type(
      "Quería preguntarles si está confirmada la reserva que realicé el día 16/6/2026 con esta misma dirección de email.",
    );

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

    cy.visit("https://automationintesting.online");

    cy.get('[data-testid="ContactName"]').type("Juan Pérez");
    cy.get('[data-testid="ContactEmail"]').type("juan_perez@prueba.com");
    cy.get('[data-testid="ContactPhone"]').type("35133221231");
    cy.get('[data-testid="ContactSubject"]').type("Pregunta sobre reserva");

    cy.get(".d-grid > .btn").click();

    cy.get(".alert > p").should("contain", "Message may not be blank");

    cy.wait("@contactFail").then((interception) => {
      expect(interception.request.body.description).to.equal("");
      expect(interception.response.statusCode).to.equal(400);
      expect(interception.response.body[0]).to.equal(
        "Message may not be blank",
      );
    });
  });

  //TC-25 Verifica si el backend rechaza correctamente
  //un mensaje que supera la longitud máxima permitida
  it("25. Mensaje de longitud máxima", () => {
    cy.intercept("POST", "/api/message").as("contactFail");

    const mensajeLargo = "A".repeat(2001);

    cy.visit("https://automationintesting.online");

    cy.get('[data-testid="ContactName"]').type("Juan Pérez");
    cy.get('[data-testid="ContactEmail"]').type("juan_perez@prueba.com");
    cy.get('[data-testid="ContactPhone"]').type("35133221231");
    cy.get('[data-testid="ContactSubject"]').type("Pregunta sobre reserva");
    cy.get('[data-testid="ContactDescription"]').type(mensajeLargo);

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

    cy.visit("https://automationintesting.online");

    cy.get('[data-testid="ContactName"]').type("Juan Pérez");
    cy.get('[data-testid="ContactEmail"]').type("juan_perez@prueba.com");
    cy.get('[data-testid="ContactPhone"]').type("35133221231");
    cy.get('[data-testid="ContactSubject"]').type("Pregunta sobre reserva");
    cy.get('[data-testid="ContactDescription"]').type(mensajeEspecial);

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
