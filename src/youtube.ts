import ytdl from 'ytdl-core';
import * as fs from 'fs';
import {MediaInfo} from './mediainfo';
import {ProgressUpdateFunc} from './progressListener';

export const download = async (updater: ProgressUpdateFunc, url: string):Promise<MediaInfo> => {
  const info = await ytdl.getInfo(url);
  const videoInfo = new MediaInfo(
      info.videoDetails.title,
      info.videoDetails.author.name,
      info.videoDetails.videoId
  );

  await fs.promises.writeFile(`public/media/${info.videoDetails.videoId}-blob.json`, JSON.stringify(info));

  console.log('title:', info.videoDetails.title);
  console.log('rating:', info.player_response.videoDetails.averageRating);
  console.log('uploaded by:', info.videoDetails.author.name);

  const video = ytdl(url);
  const downloadPromise = new Promise<MediaInfo>((resolve, reject) => {
    let starttime: number;
    video.on('error', reject);
    const videoPath = videoInfo.getVideoPath();
    const fileStream = fs.createWriteStream(videoPath);
    fileStream.on('error', reject);
    video.pipe(fileStream);

    video.once('response', () => {
      starttime = Date.now();
    });

    video.on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
      const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
      updater(0, 100, percent * 100, estimatedDownloadTime);
    });

    video.on('end', () => {
      resolve(videoInfo);
    });
  });
  return await downloadPromise;
};
