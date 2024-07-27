import { Menu } from "./Menu.js";
import { CategoryRepository } from "../backend/CategoryRepository.js";
import { BudgetDetailsMenu } from "./BudgetDetailsMenu.js";
import { input } from "@inquirer/prompts";

export class AddNewCategoryMenu extends Menu {
  infoEnteredByUser: any;

  private categoryRepository: CategoryRepository =
    CategoryRepository.getInstance();

  public async getUserInput(): Promise<void> {
    const newCategoryName = await input({
      message: "Please Enter a Name for this new category: ",
    });


    this.infoEnteredByUser = newCategoryName;
  }
  public async handleUserInput(): Promise<void> {
    this.categoryRepository.saveItem(this.infoEnteredByUser);
  }
  public determineNextMenu(): Menu {
    return new BudgetDetailsMenu();
  }
}
