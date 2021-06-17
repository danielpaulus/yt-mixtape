import ytdl from 'ytdl-core';
import * as fs from 'fs';

export const download = async (updater: ProgressUpdateFunc, url: string) => {

  const info = await ytdl.getInfo(url);
  const videoInfo = {
    title: info.videoDetails.title,
    uploadedBy: info.videoDetails.author.name,
    id: info.videoDetails.videoId
  }
  await fs.promises.writeFile(`public/media/${info.videoDetails.videoId}.json`, JSON.stringify(videoInfo))

  console.log('title:', info.videoDetails.title);
  console.log('rating:', info.player_response.videoDetails.averageRating);
  console.log('uploaded by:', info.videoDetails.author.name);

  const video = ytdl(url);
  const downloadPromise = new Promise<void>((resolve, reject) => {

    let starttime: number;
    video.on('error', reject)
    const fileStream = fs.createWriteStream(`public/media/${info.videoDetails.videoId}.webm`)
    fileStream.on('error', reject)
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
      resolve()
    });
  });
  await downloadPromise
}