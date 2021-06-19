import {QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QTextEdit, QProgressBar, QPixmap} from '@nodegui/nodegui';
import {download} from './youtube';
import {extractMp3} from './transcoder';


const defaultYoutubeLink = 'https://www.youtube.com/watch?v=7EPJEg6R3SM';
const appTitle = 'yt-mixtape';

export const initGUI = (qrCodePngFilePath: string, port: number):void => {
  const image = new QPixmap();
  image.load(qrCodePngFilePath);

  const win = new QMainWindow();
  win.setWindowTitle(appTitle);

  const centralWidget = new QWidget();
  centralWidget.setObjectName('myroot');
  const rootLayout = new FlexLayout();
  centralWidget.setLayout(rootLayout);

  const qrCodeLabel = new QLabel();
  qrCodeLabel.setPixmap(image);

  const progressBar = new QProgressBar();
  const startDownloadButton = new QPushButton();
  startDownloadButton.setText('start download');
  startDownloadButton.addEventListener('clicked', () => {
    statusLabel.setText('start download..');
    progressBar.setMinimum(0);
    progressBar.setMaximum(100);
    progressBar.reset();
    const url = youtubeLinkInput.toPlainText();
    startDownloadButton.setEnabled(false);
    download((min: number, max: number, progress: number, estimatedDownloadTime: number) => {
      progressBar.setValue(progress);
      statusLabel.setText(`remaining:${Math.round(estimatedDownloadTime * 60)}s`);
    }, url).then((filePath) => {
      statusLabel.setText('creating mp3..');
      progressBar.reset();
      extractMp3(filePath, (min, max, progress) =>{
        progressBar.setValue(progress);
      }).finally(()=>{
        statusLabel.setText('done');
        progressBar.reset();
        startDownloadButton.setEnabled(true);
      });
    }).catch(((reason) => {
      statusLabel.setText(`download failed:${reason}`);
      progressBar.reset();
      startDownloadButton.setEnabled(true);
    }));
  });

  const browserLinkLabel = new QLabel();
  browserLinkLabel.setOpenExternalLinks(true);
  browserLinkLabel.setText(`<a href="http://localhost:${port}">open in local browser</a>`);
  browserLinkLabel.setObjectName('browserLinkLabel');

  const statusLabel = new QLabel();
  statusLabel.setText('idle..');

  const youtubeLinkInput = new QTextEdit();
  youtubeLinkInput.setText(defaultYoutubeLink);

  rootLayout.addWidget(qrCodeLabel);
  rootLayout.addWidget(browserLinkLabel);
  rootLayout.addWidget(youtubeLinkInput);
  rootLayout.addWidget(startDownloadButton);
  rootLayout.addWidget(statusLabel);
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
    #browserLinkLabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
  );
  win.show();

  (global as any).win = win;
};
