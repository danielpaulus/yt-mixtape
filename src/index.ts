import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QTextEdit, QProgressBar, QListWidget, QListWidgetItem, QPixmap } from '@nodegui/nodegui';
import logo from '../assets/logox200.png';
import {download} from './youtube'
import * as fs from 'fs';

import QRCode from 'qrcode'

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import express from 'express';

import * as os from 'os'

const en0 = os.networkInterfaces()["en0"]
if (en0 === undefined){
  throw "no network interface en0 found"
}
const ipAddress = en0.filter(x=>x.family==="IPv4")[0].address
const port = "8000"
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
const image = new QPixmap();
image.load(absoulteImagePath);

const win = new QMainWindow();
win.setWindowTitle("yt-mixtape");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const qrCodeLabel = new QLabel();
qrCodeLabel.setObjectName("mylabel");
qrCodeLabel.setPixmap(image);
const progressBar = new QProgressBar();
const startDownloadButton = new QPushButton();
startDownloadButton.setText("start download")
startDownloadButton.addEventListener('clicked', ()=>{
  progressBar.setMinimum(0);
  progressBar.setMaximum(100);
  progressBar.reset();
  let url = youtubeLinkInput.toPlainText();
  
  download((min:number, max:number, progress:number)=>{
    progressBar.setValue(progress);
  }, url)
});

const browserLinkLabel = new QLabel();
browserLinkLabel.setOpenExternalLinks(true);
browserLinkLabel.setText(`<a href="http://localhost:${port}">open in local browser</a>`);
browserLinkLabel.setInlineStyle(`
  color: red;
`);


const youtubeLinkInput = new QTextEdit();
youtubeLinkInput.setText('https://www.youtube.com/watch?v=7EPJEg6R3SM');




rootLayout.addWidget(qrCodeLabel);
rootLayout.addWidget(browserLinkLabel);
rootLayout.addWidget(youtubeLinkInput);
rootLayout.addWidget(startDownloadButton);
rootLayout.addWidget(progressBar);




win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #001010;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);
win.show();

(global as any).win = win;


// rest of the code remains same
const app = express();
const PORT = Number.parseInt(port);
app.use(express.static('public'));
app.get('/', (req, res) => {
  const files:any[]  = [];
  fs.readdirSync('public/media').forEach(file => {
    if (file.endsWith(".webm")){
      const info = JSON.parse(fs.readFileSync("public/media/"+file.replace(".webm", ".json")).toString())

        files.push({filename:file, title:info.title});
    }
    
  });
  const fileLinks: string= files.map(x=> `<a href="video.html?v=${x.filename}">${x.title}</a>`).join("<br/>")
  res.send(fileLinks)
});
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});




    // open the database
    const db = await open({
      filename: 'database.db',
      driver: sqlite3.Database
    })


  })()