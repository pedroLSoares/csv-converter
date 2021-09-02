import csvtojson from 'csvtojson';
import { promisify } from 'util';
import { createReadStream, createWriteStream } from 'fs';
import debug from 'debug';
import { pipeline, Transform } from 'stream';
import iconv from 'iconv-lite';

const pipelineAsync = promisify(pipeline);
const log = debug('app:converter');
console.time('converting-data');

log('Processing');
const ONE_SECOND = 1000;

setInterval(() => process.stdout.write('.'), ONE_SECOND).unref();

const stream = createReadStream('csvname.csv').pipe(
  iconv.decodeStream('win1252')
);

const finalStream = createWriteStream('script.sql');

const handleStream = new Transform({
  transform: (chunk, enconding, cb) => {
    // console.log(chunk.toString());
    const data = JSON.parse(chunk);

    //insert sql here
    const string = '';

    return cb(null, iconv.encode(string, 'utf-8'));
  },
});

await pipelineAsync(
  stream,
  csvtojson({ delimiter: ';' }),
  handleStream,
  finalStream
);
log('finished');
console.timeEnd('converting-data');
