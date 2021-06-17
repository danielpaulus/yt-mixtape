import * as fs from 'fs';

import { initGUI } from './guiLoader'
import { generateQR } from './qrCodeGenerator'

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import express from 'express';

(async () => {
  const port = 8000
  const absoulteImagePath = await generateQR(port)
  let headless = false
  var myArgs = process.argv.slice(2);
  if (myArgs.length > 0) {
    if (myArgs[0] === "--headless") {
      console.log("running headless mode")
      headless = true
    }
  }
  if (!headless) {
    initGUI(absoulteImagePath, port)
  }

  // rest of the code remains same
  const app = express();

  app.use(express.static('public'));
  app.get('/', (req, res) => {
    const files: any[] = [];
    fs.readdirSync('public/media').forEach(file => {
      if (file.endsWith(".webm")) {
        const info = JSON.parse(fs.readFileSync("public/media/" + file.replace(".webm", ".json")).toString())

        files.push({ filename: file, title: info.title });
      }

    });
    const fileLinks: string = files.map(x => `<a href="video.html?v=${x.filename}">${x.title}</a>`).join("<br/>")
    res.send(fileLinks)
  });
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });

  // open the database
  const db = await open({
    filename: 'database.db',
    driver: sqlite3.Database
  })
})()