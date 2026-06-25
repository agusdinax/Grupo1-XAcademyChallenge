describe("Login Admin Panel - Shady Meadows B&B", () => {
  const baseUrl = "https://automationintesting.online/admin";

  beforeEach(() => {
    cy.visit(baseUrl);
    // cy.loginAdmin('user', 'pass')
  });

  it("CP-027 | Login con credenciales validas", () => {
    cy.loginAdmin("admin", "password"); // Llamada al comando personalizado para iniciar sesión antes de cada prueba

    // Verificamos la URL para asegurarse de que se ha redirigido correctamente al panel
    cy.url().should("include", "/admin/rooms");
  });

  it("CP-028 | Login con Usuario incorrecto", () => {
    cy.loginAdmin("invalidUser", "password");

    //Verificamos que el mensaje de error sea visible
    cy.get(".alert")
      .should("be.visible")
      .and("have.text", "Invalid credentials");
  });

  it("CP-029 | Login con Password incorrecto", () => {
    cy.loginAdmin("admin", "invalidPassword");

    //Verificamos que el mensaje de error sea visible
    cy.get(".alert")
      .should("be.visible")
      .and("have.text", "Invalid credentials");
  });
});
