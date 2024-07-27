import DBConnection from "./DBConnection.js";

export default class TableCreator {
  private db;

  constructor(dbConnection: DBConnection) {
    this.db = dbConnection;
  }

  async createCategoryTable() {
    await this.db.write(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0,
      is_deleted INT NOT NULL DEFAULT 0,
      date_created DATE DEFAULT current_timestamp
      );`);
  }

  async createPayeeTable() {
    await this.db.write(`CREATE TABLE IF NOT EXISTS payees (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
      );`);

    // the first payee is used to add a new row, so we create it if it there is not one present
    const addNewPayeeCheck = await this.db.read(
      `SELECT * FROM payees where id = 1`,
    );

    if (addNewPayeeCheck.length == 0) {
      await this.db.read(
        `INSERT INTO payees (name) VALUES ('+ Add New Payee') `,
      );
    }
  }

  async createTransactionTable() {
    await this.db.write(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY,
      amount REAL NOT NULL,
      category_id INTEGER NOT NULL,
      payee_id INTEGER,
      FOREIGN KEY (category_id)
          REFERENCES categories (id),
      FOREIGN KEY (payee_id)
          REFERENCES payees (id)
    );`);
  }
}
