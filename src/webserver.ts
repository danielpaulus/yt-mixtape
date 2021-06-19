import * as fs from 'fs';
import express from 'express';
import {MediaInfo} from './mediainfo';

export const configureExpress = async (app : express.Application): Promise<void>=>{
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
  app.get('/mediainfo', (req, res) => {
    const infos: any[] = [];
    fs.readdirSync('public/media').forEach((file) => {
      if (file.endsWith('.webm')) {
        const info:MediaInfo = JSON.parse(fs.readFileSync('public/media/' + file.replace('.webm', '.json')).toString());

        infos.push(info);
      }
    }); res.send(infos);
  });
};
