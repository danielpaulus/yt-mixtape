import {initGUI} from './guiLoader';
import {generateQR} from './qrCodeGenerator';
import {configureExpress} from './webserver';

import express from 'express';
import {MediaInfoRepository} from './mediaInfoRepo';

(async () => {
  const mediaInfoRepo = new MediaInfoRepository('database.db');
  await mediaInfoRepo.initDb();
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
    initGUI(absoulteImagePath, port, mediaInfoRepo);
  }

  // rest of the code remains same
  const app = express();
  configureExpress(app, mediaInfoRepo);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
})();

/*
const reset =() =>{
  const files: any[] = [];
  fs.readdirSync('public/media').forEach((file) => {
    if (file.endsWith('.webm')) {
      const info:MediaInfo = JSON.parse(fs.readFileSync('public/media/' + file.replace('.webm', '.json')).toString());

      files.push({filename: file, title: info.title});
    }
  });
};
*/
