export abstract class Repository<T> {
  abstract getItem(id: number): Promise<T>;
  abstract getAllItems(): Promise<T[]>;
  abstract deleteItem(category: T): void;
  abstract saveItem(itemDetails: any): Promise<T>;
  abstract updateItem(category: T): Promise<T>;
}
