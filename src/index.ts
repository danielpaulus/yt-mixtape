import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QTextEdit, QProgressBar, QListWidget, QListWidgetItem, QPixmap } from '@nodegui/nodegui';
import logo from '../assets/logox200.png';
import ytdl from 'ytdl-core';
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

  let url = youtubeLinkInput.toPlainText();

  
  ytdl.getInfo(url).then(info => {
    console.log('title:', info.videoDetails.title);
    console.log('rating:', info.player_response.videoDetails.averageRating);
    console.log('uploaded by:', info.videoDetails.author.name);
    console.log(JSON.stringify(info.videoDetails, null, 2));

    const video = ytdl(url);
    
    let starttime:number;
    video.pipe(fs.createWriteStream(`public/media/${info.videoDetails.videoId}.webm`));
    
    video.once('response', () => {
      starttime = Date.now();
    });
    progressBar.setMinimum(0);
    progressBar.setMaximum(100);
    progressBar.reset();
    video.on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
      const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
      progressBar.setValue(percent*100);
     /* progressBar.update();
      process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
      process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
      process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
      process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);*/
      const videoInfo = {
        title: info.videoDetails.title,
        uploadedBy: info.videoDetails.author.name,
        id:info.videoDetails.videoId
      }
      fs.writeFileSync(`public/media/${info.videoDetails.videoId}.json`, JSON.stringify(videoInfo));
      
    });
    video.on('end', () => {
      process.stdout.write('\n\n');
    });

  });

 
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