import { Context } from "../Context.js";

export abstract class Menu {
  protected context!: Context;
  abstract infoEnteredByUser: any;

  public setContext(context: Context) {
    this.context = context;
  }

  public abstract getUserInput(): Promise<void>;
  public abstract handleUserInput(): Promise<void>;
  public abstract determineNextMenu(): Menu;
}
