import { select } from "@inquirer/prompts";
import { CategoryRepository } from "../backend/CategoryRepository.js";
import { Menu } from "./Menu.js";
import { ReportMenu } from "./ReportMenu.js";

export class SelectCategoryMenu extends Menu {
  infoEnteredByUser: any;
  private categoryRepository: CategoryRepository =
    CategoryRepository.getInstance();


  public async getUserInput(): Promise<void> {
    console.clear()
    console.log("Here you see a report for all of the transactions for a certian category")

    const categories = await this.categoryRepository.getAllItems();

    const categoryChoices = categories.map((category) => {
      return {
        name: `${category.name}`,
        value: category,
      };
    });

    const selectedCategory = await select({
      message: "Please select a category that you would like to see a report for:",
      choices: categoryChoices
    })

    this.infoEnteredByUser = selectedCategory
  }
  public async handleUserInput(): Promise<void> { }

  public determineNextMenu(): Menu {
    return new ReportMenu(this.infoEnteredByUser)
  }

}
