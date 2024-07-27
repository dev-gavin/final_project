import { Menu } from "./Menu.js";
import { Payee, PayeeRepository } from "../backend/PayeeRepository.js";
import Fuse from "fuse.js";
import autocomplete from "inquirer-autocomplete-standalone";
import { LogTransactionMenu } from "./LogTransactionMenu.js";
import { input } from "@inquirer/prompts";

export class SelectPayeeMenu extends Menu {
  infoEnteredByUser!: Payee;
  private payeeRepository: PayeeRepository = PayeeRepository.getInstance()

  public async getUserInput(): Promise<void> {
    const allPayees = await this.payeeRepository.getAllItems();
    const selectedPayee = await this.selectPayee(allPayees)
    this.infoEnteredByUser = selectedPayee;
  }
  public async handleUserInput(): Promise<void> {
    if (this.infoEnteredByUser.id != 1) return

    const payeeName = await input({ message: "Please enter a name for this new Payee: " })
    this.infoEnteredByUser = await this.payeeRepository.saveItem(payeeName);

  }

  public determineNextMenu(): Menu {
    return new LogTransactionMenu(this.infoEnteredByUser)

  }

  private async selectPayee(allPayees: Payee[]) {

    const fuse = new Fuse(allPayees, {
      keys: ["name"],
    });

    const payee = await autocomplete({
      message:
        "Begin Typing to Previously Used Payees (i.e McDonalds) or create a new one:",
      searchText: "Searching for payees...",
      source: async (input) => {
        if (input) {
          const filteredResults = fuse.search(input as string);

          return filteredResults.map((result) => {
            return {
              value: result.item,
              name: result.item.name,
            };
          });
        }

        return allPayees.map(payee => {
          return {
            value: payee,
            name: payee.name
          }
        })
      },
    });
    return payee;
  }

}
