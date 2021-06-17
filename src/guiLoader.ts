import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QTextEdit, QProgressBar, QPixmap } from '@nodegui/nodegui';
import { download } from './youtube'

const defaultYoutubeLink = 'https://www.youtube.com/watch?v=7EPJEg6R3SM'
const appTitle = "yt-mixtape"

export const initGUI = (qrCodePngFilePath: string, port: number) => {
    const image = new QPixmap();
    image.load(qrCodePngFilePath);

    const win = new QMainWindow();
    win.setWindowTitle(appTitle);

    const centralWidget = new QWidget();
    centralWidget.setObjectName("myroot");
    const rootLayout = new FlexLayout();
    centralWidget.setLayout(rootLayout);

    const qrCodeLabel = new QLabel();
    qrCodeLabel.setPixmap(image);

    const progressBar = new QProgressBar();
    const startDownloadButton = new QPushButton();
    startDownloadButton.setText("start download")
    startDownloadButton.addEventListener('clicked', () => {
        statusLabel.setText("downloading..")
        progressBar.setMinimum(0);
        progressBar.setMaximum(100);
        progressBar.reset();
        let url = youtubeLinkInput.toPlainText();
        startDownloadButton.setEnabled(false)
        download((min: number, max: number, progress: number) => {
            progressBar.setValue(progress);
        }, url).then(() => {
            statusLabel.setText("done..")
        }).catch((reason => {
            statusLabel.setText(`download failed:${reason}`)
        }))
            .finally(() => {
                progressBar.reset()
                startDownloadButton.setEnabled(true)
            })
    });

    const browserLinkLabel = new QLabel();
    browserLinkLabel.setOpenExternalLinks(true);
    browserLinkLabel.setText(`<a href="http://localhost:${port}">open in local browser</a>`);
    browserLinkLabel.setObjectName("browserLinkLabel");

    const statusLabel = new QLabel();
    statusLabel.setText("idle..")

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
}