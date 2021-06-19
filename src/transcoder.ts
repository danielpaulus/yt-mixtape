import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

import ffmpegPath from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';

import {ProgressUpdateFunc} from './progressListener';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobe.path);

export const extractMp3 = async (filePath:string, updater: ProgressUpdateFunc):Promise<void> =>{
  const mp3FileStream = fs.createWriteStream(filePath.replace('.webm', '.mp3'));

  const ffmpegStream = ffmpeg(filePath).format('mp3');


  // need to call this to get percentage in the progress updates later
  ffmpegStream.ffprobe((err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.info(data);
    }
  });

  ffmpegStream.pipe(mp3FileStream);

  const transcodingPromise = new Promise<void>((resolve, reject) => {
    mp3FileStream.on('finish', ()=>{
      resolve();
    });

    ffmpegStream.on('progress', function(progress) {
      updater(0, 100, progress.percent, -1);
    });

    mp3FileStream.on('error', (err)=>{
      reject(err);
    });
  });
  await transcodingPromise;
};
