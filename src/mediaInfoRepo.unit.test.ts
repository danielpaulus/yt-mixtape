import * as fs from 'fs';
import {MediaInfo} from './mediainfo';
import {MediaInfoRepository} from './mediaInfoRepo';

let repo:MediaInfoRepository;

beforeEach(async ()=>{
  repo = new MediaInfoRepository('test.db');
  await repo.initDb();
});

it('initializes the db only once', async ()=>{
  await repo.initDb();
  await repo.initDb();
});
it('can insert an element', async ()=>{
  const firstList = await repo.list();
  expect(firstList).toStrictEqual([]);

  const info = new MediaInfo('test_title', 'dan', 'someID');
  await repo.add(info);

  const secondList = await repo.list();
  expect(secondList).toStrictEqual([info]);
});

afterEach(()=>{
  fs.promises.unlink('test.db');
});
