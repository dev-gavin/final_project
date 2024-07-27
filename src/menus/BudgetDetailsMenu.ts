import { input, select, Separator } from "@inquirer/prompts";
import { Category, CategoryRepository } from "./../backend/CategoryRepository.js";
import { Menu } from "./Menu.js";
import { MainMenu } from "./MainMenu.js";
import { AddNewCategoryMenu } from "./AddNewCategoryMenu.js";
import { ChoiceOrSeparatorArray } from "inquirer-autocomplete-standalone";

export enum BudgetDetailsMenuChoices {
  SeeMainMenu = "MAIN_MENU",
  AddNewCategory = "ADD_NEW_CATEGORY",
}

type BudgetDetailChoices = BudgetDetailsMenuChoices | Category

export class BudgetDetailsMenu extends Menu {
  infoEnteredByUser: BudgetDetailChoices;

  private categoryRepository: CategoryRepository =
    CategoryRepository.getInstance();

  public async getUserInput(): Promise<void> {
    const categories = await this.categoryRepository.getAllItems();

    const categoryChoices = categories.map((category) => {
      return {
        name: `${category.name} - $${category.balance}`,
        value: category,
        description: `Edit the '${category.name}' category`,
      };
    });

    const answer = await select(
      {
        message: "Please Select an Option Below!\n",
        choices: [
          new Separator("--- Budget Categories ---"),
          new Separator(),
          ...categoryChoices,
          new Separator(" "),
          new Separator(" "),
          new Separator("--- Other Options ---"),
          new Separator(" "),
          {
            name: "Go Back to Main Menu",
            value: BudgetDetailsMenuChoices.SeeMainMenu,
          },
          {
            name: "+ Add a New Category",
            value: BudgetDetailsMenuChoices.AddNewCategory,
          },
        ] as ChoiceOrSeparatorArray<Category>,
        pageSize: categoryChoices.length + 10,
      },
      { clearPromptOnDone: true },
    );

    this.infoEnteredByUser = answer;
  }

  public async handleUserInput(): Promise<void> {
    if (this.infoEnteredByUser instanceof Category) {
      const newCategoryName = await input({ message: `Please enter a new name for '${this.infoEnteredByUser.name}' category: ` })
      this.infoEnteredByUser.name = newCategoryName
      await this.categoryRepository.updateItem(this.infoEnteredByUser);
    }
  }

  public determineNextMenu(): Menu {
    switch (this.infoEnteredByUser) {
      case BudgetDetailsMenuChoices.SeeMainMenu:
        return new MainMenu();
      case BudgetDetailsMenuChoices.AddNewCategory:
        return new AddNewCategoryMenu();
    }
    return new BudgetDetailsMenu();
  }
}
