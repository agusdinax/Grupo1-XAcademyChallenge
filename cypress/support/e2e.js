import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

//Si la pagina arroja el error Minified React Error #418
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("Minified React error #418")) {
    return false;
  }
});
