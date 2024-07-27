import { number, select } from "@inquirer/prompts";
import { Category, CategoryRepository } from "../backend/CategoryRepository.js";
import { Menu } from "./Menu.js"
import { Payee } from "../backend/PayeeRepository.js";
import { Transaction, TransactionRepository } from "../backend/TransactionRepository.js";
import { MainMenu } from "./MainMenu.js";

type InfoEnteredByUser = {
  category: Category | undefined,
  payee: Payee,
  amount: number | undefined
}

export class LogTransactionMenu extends Menu {
  infoEnteredByUser: InfoEnteredByUser = { category: undefined, payee: {} as Payee, amount: undefined };

  private categoryRepository: CategoryRepository =
    CategoryRepository.getInstance();
  private transactionRepository: TransactionRepository =
    TransactionRepository.getInstance();

  constructor(payee: Payee) {
    super()
    this.infoEnteredByUser.payee = payee
  }


  public async getUserInput(): Promise<void> {
    const categories = await this.categoryRepository.getAllItems();
    const categoryChoices = categories.map((category: Category) => {
      return {
        name: `${category.name} - $${category.balance}`,
        value: category,
      };
    });

    this.infoEnteredByUser.category = await select({
      message: "Please choose a category that this transaction applies to: ",
      choices: [...categoryChoices],
    });

    this.infoEnteredByUser.amount = await number({
      message: `Amount (a positve amount is a cash outflow, so if this is a cash inflow enter a negative (-))\nThe current category balance is $${this.infoEnteredByUser.category.balance}: `,
      validate: this.validateTransactionAmount,
      max: this.infoEnteredByUser.category.balance,
      step: 'any'
    });
  }

  public async handleUserInput(): Promise<void> {
    if (!this.infoEnteredByUser.category || !this.infoEnteredByUser.amount) {
      throw new Error('Category or amount not properly set');
    }
    const transaction = new Transaction(undefined, this.infoEnteredByUser.amount, this.infoEnteredByUser.category, this.infoEnteredByUser.payee)

    await this.transactionRepository.saveItem(transaction);

    this.infoEnteredByUser.category.balance -= this.infoEnteredByUser.amount
    await this.categoryRepository.updateItem(this.infoEnteredByUser.category);

  }
  public determineNextMenu(): Menu {
    return new MainMenu()
  }

  private async validateTransactionAmount(value: number | undefined) {
    if (!value || value == 0) return "Please Enter a NON-ZERO transaction amount"
    return true
  }

}
