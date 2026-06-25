describe("Seguridad Admin Panel - Shady Meadows B&B", () => {
  const baseUrl = "https://automationintesting.online/admin";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("CP-033 | Acceso sin login", () => {
    // Intentamos acceder directamente a una ruta protegida sin loguearnos
    cy.visit(`${baseUrl}/message`);

    // El sistema debería bloquear el acceso y mostrarnos el formulario de login
    cy.get("#username", { timeout: 3000 }).should("be.visible");
    cy.get("h2").should("contain", "Login");
    cy.get("navbar").should("not.exist");
  });

  it("CP-034 | Intento de ingreso con credenciales vulneradas (SQLi)", () => {
    // Intentamos un ataque de inyección SQL en el campo de password
    const sqli = "' OR 1=1 --";
    cy.visit("https://automationintesting.online/admin/");
    cy.get('[id="username"]').type("admin");
    cy.get('[id="password"]').type(sqli);
    cy.get('[id="doLogin"]').click();

    //Verificamos que el mensaje de error sea visible
    cy.get(".alert")
      .should("be.visible")
      .and("have.text", "Invalid credentials");
  });

  it("CP-035 | Refresh de sesión", () => {
    // Primero hacemos login
    cy.visit(baseUrl);
    cy.get('[id="username"]').type("admin");
    cy.get('[id="password"]').type("password");
    cy.get('[id="doLogin"]').click();
    cy.contains("Restful Booker Platform Demo").should("be.visible");
    cy.url().should("include", "/admin/rooms");

    // Recargamos la página (F5)
    cy.reload();

    // Verificamos que la sesión se mantiene y el dashboard sigue visible
    cy.contains("Restful Booker Platform Demo").should("be.visible");
    cy.get('[id="username"]').should("not.exist");
    cy.url().should("include", "/admin/rooms");
  });
});
