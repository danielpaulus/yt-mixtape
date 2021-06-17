import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QTextEdit, QProgressBar, QListWidget, QListWidgetItem } from '@nodegui/nodegui';
import logo from '../assets/logox200.png';
import ytdl from 'ytdl-core';
import * as fs from 'fs';

const win = new QMainWindow();
win.setWindowTitle("Hello World");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("wasup");
const progressBar = new QProgressBar();
const button = new QPushButton();
button.setIcon(new QIcon(logo));
button.addEventListener('clicked', ()=>{

  let url = textEdit.toPlainText();

  ytdl.getInfo(url).then(info => {
    console.log('title:', info.videoDetails.title);
    console.log('rating:', info.player_response.videoDetails.averageRating);
    console.log('uploaded by:', info.videoDetails.author.name);
    console.log(JSON.stringify(info.videoDetails, null, 2));
  });

  const video = ytdl(url);
  let starttime:number;
  video.pipe(fs.createWriteStream("output.webm"));
  
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
    
    
  });
  video.on('end', () => {
    process.stdout.write('\n\n');
  });
});
const playbutton = new QPushButton();
playbutton.setText("play");
playbutton.addEventListener('clicked', ()=>{

});
const label2 = new QLabel();
label2.setOpenExternalLinks(true);
label2.setText('<a href="http://localhost:8000">open player</a> ');
label2.setInlineStyle(`
  color: red;
`);


const textEdit = new QTextEdit();
textEdit.setText('https://www.youtube.com/watch?v=7EPJEg6R3SM');


const listWidget = new QListWidget();

for (let i = 0; i < 30; i++) {
let listWidgetItem = new QListWidgetItem();
listWidgetItem.setText('listWidgetItem ' + i);
if (i===3) {
listWidgetItem.setCheckState(2);
} else {
listWidgetItem.setCheckState(0);
}
listWidget.addItem(listWidgetItem);
}

rootLayout.addWidget(label);
rootLayout.addWidget(progressBar);
rootLayout.addWidget(button);
rootLayout.addWidget(label2);
rootLayout.addWidget(textEdit);
rootLayout.addWidget(playbutton);
rootLayout.addWidget(listWidget);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #009688;
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

import express from 'express';
// rest of the code remains same
const app = express();
const PORT = 8000;
app.use(express.static('public'));
app.get('/', (req, res) => res.send('Express + TypeScript Server'));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// this is a top-level await 
(async () => {
    // open the database
    const db = await open({
      filename: 'database.db',
      driver: sqlite3.Database
    })
})()