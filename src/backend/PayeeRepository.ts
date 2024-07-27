import DBConnection from "./db/DBConnection.js";
import { Repository } from "./Repository.js";

export class PayeeRepository extends Repository<Payee> {
  static instance: PayeeRepository;
  private db: DBConnection = DBConnection.instance;

  static getInstance(): PayeeRepository {
    if (!PayeeRepository.instance) {
      PayeeRepository.instance = new PayeeRepository();
    }
    return PayeeRepository.instance;
  }


  async getItem(id: number): Promise<Payee> {
    const payeeRecords = await this.db.read(
      `SELECT * FROM categories c WHERE c.id = ${id});`,
    );

    return new Payee(
      payeeRecords.id,
      payeeRecords.name,
    );

  }
  async getAllItems(): Promise<Payee[]> {
    const payeeRecords = await this.db.read(`SELECT * FROM payees c`);

    return payeeRecords.map((payeeRecord) => {
      return new Payee(payeeRecord.id, payeeRecord.name);
    });

  }
  deleteItem(payee: Payee): void {
    throw new Error("Method not implemented.");
  }
  async saveItem(name: string): Promise<Payee> {
    const { lastId } = await this.db.write(
      `INSERT INTO payees (name) VALUES ('${name}');`,
    );
    return new Payee(lastId, name);
  }
  updateItem(category: Payee): Promise<Payee> {
    throw new Error("Method not implemented.");
  }
}

export class Payee {
  private _id: number;
  private _name: string;

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  constructor(id: number, name: string) {
    this._id = id
    this._name = name
  }
}
