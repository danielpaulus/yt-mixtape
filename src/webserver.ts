import express from 'express';
import {MediaInfoRepository} from './mediaInfoRepo';

export const configureExpress = async (app: express.Application, mediaInfoRepo: MediaInfoRepository): Promise<void> => {
  app.use(express.static('public'));
  /* app.get('/', async (req, res) => {
     const mediaFiles = await mediaInfoRepo.list();
     const fileLinks: string = mediaFiles.map((x) => `<a href="video.html?v=${x.id}">${x.title}</a>`).join('<br/>');
     res.send(fileLinks);
   });*/
  app.get('/mediainfo', async (req, res) => {
    const infos = await mediaInfoRepo.list();
    res.send(infos);
  });
};
