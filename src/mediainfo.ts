const mediaRoot ='public/media';

/* eslint-disable require-jsdoc */
export class MediaInfo {
  constructor(
        readonly title: string,
        readonly uploadedBy: string,
        readonly id: string,
  ) { }
  getMp3Path():string {
    return `${mediaRoot}/${this.id}.mp3`;
  }
  getVideoPath():string {
    return `${mediaRoot}/${this.id}.webm`;
  }
}
