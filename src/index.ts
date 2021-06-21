import * as fs from 'fs';
import {initGUI} from './guiLoader';
import {generateQR} from './qrCodeGenerator';
import {configureExpress} from './webserver';

import express from 'express';
import {MediaInfoRepository} from './mediaInfoRepo';

import {getMediaInfo} from './youtube';
import {extractMp3} from './transcoder';
/**
 * fixDb re-creates the database by listing all webm files, transcoding to mp3 if needed
 * and redownloading the youtube info.
 *
 */
const fixDb = async () =>{
  const files = fs.readdirSync('public/media');
  fs.unlinkSync('database.db');
  const mediaInfoRepo = new MediaInfoRepository('database.db');
  await mediaInfoRepo.initDb();
  for (const file of files) {
    if (file.endsWith('.json')) {
      console.log('deleting old json:'+file);
      fs.unlinkSync('public/media/'+file);
    }
    if (file.endsWith('.webm')) {
      console.log('found downloaded video:'+file);
      const id = file.replace('.webm', '');
      console.log('getting media info for'+id);
      try {
        const info = await getMediaInfo(id);
        if (!fs.existsSync(info.getMp3Path())) {
          console.log('need to transcode'+info.getMp3Path());
          await extractMp3(info, (min, max, progress)=>{
            console.log(progress);
          });
        }
        await mediaInfoRepo.add(info);
        console.log('done fixing:'+ info.getVideoPath());
      } catch (e) {
        console.log(e);
      }
    }
  }
};

(async () => {
  let headless = false;
  const myArgs = process.argv.slice(2);
  if (myArgs.length > 0) {
    if (myArgs[0] === '--headless') {
      console.log('running headless mode');
      headless = true;
    }
    if (myArgs[0] === '--fixdb') {
      await fixDb();
      process.exit(0);
    }
  }
  const mediaInfoRepo = new MediaInfoRepository('database.db');
  await mediaInfoRepo.initDb();
  const port = 8000;
  const absoulteImagePath = await generateQR(port);

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


