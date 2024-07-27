import { Menu } from "./Menu.js"

export class Exit extends Menu {
  infoEnteredByUser: any;
  public getUserInput(): Promise<void> {
    process.exit()
  }
  public handleUserInput(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public determineNextMenu(): Menu {
    throw new Error("Method not implemented.");
  }

}
