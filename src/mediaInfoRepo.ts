import sqlite3 from 'sqlite3';
import {open, Database as GDatabase} from 'sqlite';
import {MediaInfo} from './mediainfo';

export class MediaInfoRepository {
  db: Promise<GDatabase<sqlite3.Database, sqlite3.Statement>>;
  constructor(dbFile: string) {
    this.db = open({
      filename: dbFile,
      driver: sqlite3.Database,
    });
  }
  async initDb(): Promise<void> {
    const db = await this.db;
    await db.run(`CREATE TABLE IF NOT EXISTS mediainfo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT,
        title TEXT,
        uploaded_by TEXT)`);
  }

  async list():Promise<MediaInfo[]> {
    const dbset = await (await this.db).all(`SELECT * from mediainfo`);
    const result:MediaInfo[] = [];
    dbset.forEach(function(value) {
      result.push(new MediaInfo(value.title, value.uploaded_by, value.video_id));
    });
    return result;
  }

  async add(m:MediaInfo) :Promise<void> {
    await (await this.db).run(`INSERT INTO mediainfo (video_id, title, uploaded_by)
      VALUES (?, ?, ?)`, [m.id, m.title, m.uploadedBy]);
  }
}


