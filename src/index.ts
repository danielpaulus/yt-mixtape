

import * as fs from 'fs';

import QRCode from 'qrcode'

import { initGUI } from './guiLoader'


import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import express from 'express';

import * as os from 'os'

const en0 = os.networkInterfaces()["en0"]
if (en0 === undefined) {
  throw "no network interface en0 found"
}
const ipAddress = en0.filter(x => x.family === "IPv4")[0].address
const port = 8000
const generateQR = async (text: string) => {
  try {
    await QRCode.toFile("temp/qr.png", text)
  } catch (err) {
    console.error(err)
  }
}
(async () => {
  await generateQR(`http://${ipAddress}:${port}`)

  const absoulteImagePath = 'temp/qr.png';

  initGUI(absoulteImagePath, port)

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