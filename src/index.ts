import {initGUI} from './guiLoader';
import {generateQR} from './qrCodeGenerator';
import {configureExpress} from './webserver';

import express from 'express';

(async () => {
  const port = 8000;
  const absoulteImagePath = await generateQR(port);
  let headless = false;
  const myArgs = process.argv.slice(2);
  if (myArgs.length > 0) {
    if (myArgs[0] === '--headless') {
      console.log('running headless mode');
      headless = true;
    }
  }
  if (!headless ) {
    initGUI(absoulteImagePath, port);
  }

  // rest of the code remains same
  const app = express();
  configureExpress(app);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });

  /*
  import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
  // open the database
  const db = await open({
    filename: 'database.db',
    driver: sqlite3.Database
  })*/
})();
