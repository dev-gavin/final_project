import { Menu } from "./menus/Menu.js";

export class Context {
  private menu!: Menu;

  constructor(state: Menu) {
    this.transitionTo(state);
  }

  public transitionTo(menu: Menu) {
    this.menu = menu;
    this.menu.setContext(this);
  }

  public async getUserInput() {
    await this.menu.getUserInput();
  }

  public async handleUserInput() {
    await this.menu.handleUserInput();
  }

  public determineNextMenu(): Menu {
    return this.menu.determineNextMenu();
  }
}
