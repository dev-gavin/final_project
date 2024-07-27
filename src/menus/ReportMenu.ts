import { select } from "@inquirer/prompts";
import { Category } from "../backend/CategoryRepository.js";
import { TransactionRepository } from "../backend/TransactionRepository.js";
import { Menu } from "./Menu.js";
import { MainMenu } from "./MainMenu.js";
import { SelectCategoryMenu } from "./SelectCategoryMenu.js";

export enum ReportMenuChoices {
  SeeMainMenu = "SEE_MAIN_MENU",
  RunReport = "RUN_REPORT",
}


export class ReportMenu extends Menu {
  infoEnteredByUser: any;
  reportCategory: Category
  private transactionRepository: TransactionRepository =
    TransactionRepository.getInstance();

  constructor(category: Category) {
    super()
    this.reportCategory = category;
  }

  public async getUserInput(): Promise<void> {
    const transactions = await this.transactionRepository.getTransactionsByCategory(this.reportCategory);

    console.clear()
    console.log('------------------------')
    console.log(`"${this.reportCategory.name}" Category Report | Current Balance $${this.reportCategory.balance}\t`)
    console.log('------------------------\n')

    console.log('Amount\t\Payee')
    console.log('------------------------')
    transactions.forEach(transaction => {
      console.log(`$ ${transaction.amount.toLocaleString()}     ${transaction.payee.name}`)
    })

    console.log("\n")

    this.infoEnteredByUser = await select({
      message: "How would you like to proceed?\n", choices: [
        {
          name: "Run another report",
          value: ReportMenuChoices.RunReport
        },
        {
          name: "Go Back to Main Menu",
          value: ReportMenuChoices.SeeMainMenu
        }
      ]
    })
  }
  public async handleUserInput(): Promise<void> { }

  public determineNextMenu(): Menu {
    switch (this.infoEnteredByUser) {
      case ReportMenuChoices.SeeMainMenu:
        return new MainMenu()
      case ReportMenuChoices.RunReport:
        return new SelectCategoryMenu()
    }

  }
}
