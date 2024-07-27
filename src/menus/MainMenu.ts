import { select, Separator } from "@inquirer/prompts";
import { Menu } from "./Menu.js";
import { BudgetDetailsMenu } from "./BudgetDetailsMenu.js";
import { SelectPayeeMenu } from "./SelectPayeeMenu.js";
import { SelectCategoryMenu } from "./SelectCategoryMenu.js";
import { Exit } from "./Exit.js";

export enum MainMenuChoices {
  SeeBudgetDetails = "SEE_BUDGET_DETAILS",
  CreateTransaction = "CREATE_TRANSACTION",
  RunReport = "RUN_REPORT",
  Exit = 'EXIT'
}

export class MainMenu extends Menu {
  infoEnteredByUser!: MainMenuChoices;

  public async getUserInput(): Promise<void> {
    console.clear()
    const answer = await select(
      {
        message: 'Please Select an Option Below!\n',
        choices: [
          {
            name: "See Budget/Edit Details",
            value: MainMenuChoices.SeeBudgetDetails,
          },
          {
            name: "Log Transaction",
            value: MainMenuChoices.CreateTransaction,
          },
          {
            name: "Run Report",
            value: MainMenuChoices.RunReport,
          },
          new Separator(),
          {
            name: "Exit Program",
            value: MainMenuChoices.Exit,
          },
        ],
      },
      { clearPromptOnDone: true },
    );
    this.infoEnteredByUser = answer;
  }
  public async handleUserInput(): Promise<void> { }

  public determineNextMenu(): Menu {
    switch (this.infoEnteredByUser) {
      case MainMenuChoices.SeeBudgetDetails:
        return new BudgetDetailsMenu();
      case MainMenuChoices.CreateTransaction:
        return new SelectPayeeMenu();
      case MainMenuChoices.RunReport:
        return new SelectCategoryMenu()
      case MainMenuChoices.Exit:
        return new Exit()
    }

  }
}
