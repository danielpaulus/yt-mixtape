
import sqlite3 from 'sqlite3';
import {open, Database as GDatabase} from 'sqlite';

export class MediaInfoRepository {
  db: Promise<GDatabase<sqlite3.Database, sqlite3.Statement>>;
  constructor() {
    this.db = open({
      filename: 'database.db',
      driver: sqlite3.Database,
    });
  }
  async dothings() {
    const db = await this.db;
    return db.run(`CREATE TABLE todo(
        task text
      );`);
  }
}


