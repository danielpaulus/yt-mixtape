import * as fs from 'fs';
import express from 'express';
import {MediaInfo} from './mediainfo';
import {MediaInfoRepository} from './mediaInfoRepo';

export const configureExpress = async (app : express.Application, mediaInfoRepo:MediaInfoRepository): Promise<void>=>{
  app.use(express.static('public'));
  app.get('/', (req, res) => {
    const files: any[] = [];
    fs.readdirSync('public/media').forEach((file) => {
      if (file.endsWith('.webm')) {
        const info:MediaInfo = JSON.parse(fs.readFileSync('public/media/' + file.replace('.webm', '.json')).toString());

        files.push({filename: file, title: info.title});
      }
    });
    const fileLinks: string = files.map((x) => `<a href="video.html?v=${x.filename}">${x.title}</a>`).join('<br/>');
    res.send(fileLinks);
  });
  app.get('/mediainfo', async (req, res) => {
    const infos = await mediaInfoRepo.list();
    res.send(infos);
  });
};
