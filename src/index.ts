import { MainMenu } from "./menus/MainMenu.js";
import { Context } from "./Context.js";
import AppSetup from "./backend/db/AppSetup.js";
console.clear();

AppSetup.initialize()
const context = new Context(new MainMenu());

while (true) {
  await context.getUserInput();
  await context.handleUserInput();
  const nextMenu = context.determineNextMenu();
  context.transitionTo(nextMenu);
}
