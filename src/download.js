// @flow

import fs from 'fs';
import download from 'download';
import Multiprogress from 'multi-progress';

const barFactory = new Multiprogress(process.stderr);

export default (url: string, destinationPath: string): Promise<string> => {
  const bar = barFactory.newBar('  downloading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: 0,
  });

  return download(url)
  .on('response', res => {
    bar.total = res.headers['content-length'];
    res.on('data', data => bar.tick(data.length));
  })
  .then((fileData) => {
    fs.writeFileSync(destinationPath, fileData);

    return destinationPath;
  });
};

