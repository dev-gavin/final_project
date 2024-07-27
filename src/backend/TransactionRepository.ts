import DBConnection from "./db/DBConnection.js";
import { Category } from "./CategoryRepository.js";
import { Payee } from "./PayeeRepository.js";
import { Repository } from "./Repository.js";

type TransactionRecord = {
  transaction_id: number
  transaction_amount: number
  payee_id: number
  payee_name: string
  category_id: number
  category_name: string
  category_balance: number
}



export class TransactionRepository extends Repository<Transaction> {
  static instance: TransactionRepository;
  private db: DBConnection = DBConnection.instance;

  static getInstance(): TransactionRepository {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository();
    }

    return TransactionRepository.instance;
  }

  async getItem(id: number): Promise<Transaction> {
    const transactionRecord: TransactionRecord = await this.db.read(
      `Select
          t.id AS 'transaction_id',
          t.amount AS 'transaction_amount',
          p.id AS 'payee_id',
          p.name AS 'payee_name',
          c.id AS 'category_id',
          c.name AS 'category_name',
          c.balance AS 'category_balance'
      FROM
          transactions t
      JOIN payees p ON
          t.payee_id = p.id
      JOIN categories c ON
          t.category_id = c.id
      where t.id = ${id};`
    );

    return this.buildTransactionObject(transactionRecord)
  }

  async getAllItems(): Promise<Transaction[]> {
    const transactionRecords: TransactionRecord[] = await this.db.read(
      `Select
          t.id AS 'transaction_id',
          t.amount AS 'transaction_amount',
          p.id AS 'payee_id',
          p.name AS 'payee_name',
          c.id AS 'category_id',
          c.name AS 'category_name',
          c.balance AS 'category_balance'
      FROM
          transactions t
      JOIN payees p ON
          t.payee_id = p.id
      JOIN categories c ON
          t.category_id = c.id;`,
    );

    return transactionRecords.map((transactionRecord) => {
      return this.buildTransactionObject(transactionRecord)
    });
  }

  async deleteItem(transaction: Transaction): Promise<void> {
    await this.db.write(
      `DELETE FROM transactions t WHERE t.id = ${transaction.id};`,
    );
  }
  async saveItem(transaction: Transaction): Promise<Transaction> {
    const { lastId } = await this.db.write(
      `INSERT INTO transactions (amount, category_id, payee_id) VALUES (${transaction.amount}, ${transaction.category.id}, ${transaction.payee.id});`,
    );
    return transaction;
  }
  async updateItem(updatedCategory: Transaction): Promise<Transaction> {

    throw new Error("not yet implemented")
    // await this.db.write(
    //   `UPDATE transactions SET name = '${updatedCategory.name}', balance = ${updatedCategory.balance} WHERE id = ${updatedCategory.id}`,
    // );
    // return updatedCategory;
  }

  async getTransactionsByCategory(category: Category): Promise<Transaction[]> {
    const transactionRecords: TransactionRecord[] = await this.db.read(
      `Select
          t.id AS 'transaction_id',
          t.amount AS 'transaction_amount',
          p.id AS 'payee_id',
          p.name AS 'payee_name',
          c.id AS 'category_id',
          c.name AS 'category_name',
          c.balance AS 'category_balance'
      FROM
          transactions t
      JOIN payees p ON
          t.payee_id = p.id
      JOIN categories c ON
          t.category_id = c.id
      WHERE t.category_id = ${category.id}`,
    );

    return transactionRecords.map((transactionRecord) => {
      return this.buildTransactionObject(transactionRecord)
    });
  }

  private buildTransactionObject(transactionRecord: TransactionRecord) {
    return new Transaction(
      transactionRecord.transaction_id,
      transactionRecord.transaction_amount,
      new Category(transactionRecord.category_id, transactionRecord.category_name, transactionRecord.category_balance),
      new Payee(transactionRecord.payee_id, transactionRecord.payee_name),
    );
  }
}

export class Transaction {
  private _id: number | undefined;
  private _amount: number;
  private _category: Category;
  private _payee: Payee;

  constructor(id: number | undefined, amount: number, category: Category, payee: Payee) {
    if (id) {
      this._id = id
    }
    this._amount = amount;
    this._category = category;
    this._payee = payee;
  }

  public get id(): number | undefined {
    return this._id;
  }

  public get amount(): number {
    return this._amount;
  }
  public set amount(value: number) {
    this._amount = Math.round(value * 100) / 100;
  }

  public get category(): Category {
    return this._category;
  }

  public get payee(): Payee {
    return this._payee;
  }
}

