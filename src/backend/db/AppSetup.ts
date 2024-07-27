import DBConnection from "./DBConnection.js";
import TableCreator from "./TableCreator.js";

export default class AppSetup {
  static async initialize() {
    const db = DBConnection.instance;
    const tableCreator = new TableCreator(db);
    await tableCreator.createCategoryTable();
    await tableCreator.createPayeeTable();
    await tableCreator.createTransactionTable();
  }
}
