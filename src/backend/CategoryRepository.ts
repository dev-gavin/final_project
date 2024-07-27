import DBConnection from "./db/DBConnection.js";
import { Repository } from "./Repository.js";

export class CategoryRepository extends Repository<Category> {
  static instance: CategoryRepository;
  private db: DBConnection = DBConnection.instance;

  static getInstance(): CategoryRepository {
    if (!CategoryRepository.instance) {
      CategoryRepository.instance = new CategoryRepository();
    }
    return CategoryRepository.instance;
  }

  async getItem(id: number): Promise<Category> {
    const categoryRecord = await this.db.read(
      `SELECT * FROM categories c WHERE c.id = ${id});`,
    );

    return new Category(
      categoryRecord.id,
      categoryRecord.name,
      categoryRecord.balance,
    );
  }

  async getAllItems(): Promise<Category[]> {
    const categoryRecords = await this.db.read(
      `SELECT * FROM categories c WHERE c.is_deleted = 0;`,
    );

    return categoryRecords.map((category) => {
      return new Category(category.id, category.name, category.balance);
    });
  }

  async deleteItem(category: Category): Promise<void> {
    await this.db.write(
      `DELETE FROM categories c WHERE c.id = ${category.id};`,
    );
  }
  async saveItem(newCategoryName: string): Promise<Category> {

    const { lastId } = await this.db.write(
      `INSERT INTO categories (name, balance) VALUES ('${newCategoryName}', 0);`,
    );

    return new Category(lastId, newCategoryName, 0)

  }
  async updateItem(updatedCategory: Category): Promise<Category> {
    await this.db.write(
      `UPDATE categories SET name = '${updatedCategory.name}', balance = ${updatedCategory.balance} WHERE id = ${updatedCategory.id}`,
    );
    return updatedCategory;
  }
}

export class Category {
  private _id: number;
  name: string;
  private _balance: number;

  constructor(id: number, name: string, balance: number) {
    this._id = id;
    this.name = name;
    this._balance = balance;
  }

  public get balance(): number {
    return this._balance;
  }

  public set balance(value: number) {
    if (value < 0) {
      throw new Error("Cannot have balance less than $0");
    }
    this._balance = Math.round(value * 100) / 100;
  }

  public get id(): number {
    return this._id;
  }
}
