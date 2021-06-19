import ffmpeg from 'fluent-ffmpeg'
import * as fs from 'fs'

import ffmpegPath from 'ffmpeg-static' 

ffmpeg.setFfmpegPath(ffmpegPath);

export const extractMp3 = async (filePath:string, updater: ProgressUpdateFunc) =>{
    var readStream = fs.createReadStream(filePath);
    var mp3FileStream = fs.createWriteStream(filePath.replace(".webm", ".mp3"));

    const ffmpegStream = ffmpeg(filePath).format('mp3');
    ffmpegStream.pipe(mp3FileStream);
    
    const transcodingPromise = new Promise<void>((resolve, reject) => {
   
        mp3FileStream.on('finish', ()=>{
       
             resolve()
            })

            ffmpegStream.on('progress', function(progress) {
                console.log(progress)
                updater(0,100,progress.percent, -1)
              });

            mp3FileStream.on('error', (err)=>{
            reject(err)
            })
        })
        await transcodingPromise

}