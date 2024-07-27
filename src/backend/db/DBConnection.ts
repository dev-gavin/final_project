import sqlite3 from "sqlite3";

export default class DBConnection {
  static #instance: DBConnection;
  private connection: sqlite3.Database;

  private constructor() {
    this.connection = new sqlite3.Database("./src/backend/db/db.sqlite");
  }

  public static get instance(): DBConnection {
    if (!DBConnection.#instance) {
      DBConnection.#instance = new DBConnection();
    }
    return DBConnection.#instance;
  }

  public read(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public write(sql: string, params?: any[]): Promise<{ lastId: number, changes: number }> {
    return new Promise((resolve, reject) => {
      this.connection.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastId: this.lastID, changes: this.changes });
        }
      });
    });
  }
}
