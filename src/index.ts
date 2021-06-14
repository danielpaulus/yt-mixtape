import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QTextEdit, QProgressBar } from '@nodegui/nodegui';
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
    progressBar.update();
    process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
    process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
    process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
    process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
    
  });
  video.on('end', () => {
    process.stdout.write('\n\n');
  });
});

const label2 = new QLabel();
label2.setText("World");
label2.setInlineStyle(`
  color: red;
`);


const textEdit = new QTextEdit();
rootLayout.addWidget(label);
rootLayout.addWidget(progressBar);
rootLayout.addWidget(button);
rootLayout.addWidget(label2);
rootLayout.addWidget(textEdit);
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
