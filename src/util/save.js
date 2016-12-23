// @flow

import path from 'path';
import fs from 'fs';

// use a Flow type import to get our Produce type
import type {Produce} from './types';

export default function saveInventory(inventory: Array<Produce>): Promise<string> {
  let outpath = path.join(__dirname, '..', '..', 'data', 'produce.json');

  return new Promise((resolve, reject) => {
    // lets not write to the file if we're running tests
    if (process.env.NODE_ENV !== 'test') {
      fs.writeFile(outpath, JSON.stringify(inventory, null, '\t'), (err) => {
        (err) ? reject(err) : resolve(outpath);
      });
    }
  });
}

export function genId(prod: Produce, inv: Array<Produce>): number {
  let maxId: number | typeof undefined = inv[0].id;
  inv.slice(1).forEach((item) => {
    if (item.id && item.id > maxId) maxId = item.id;
  });
  return maxId + 1;
}
