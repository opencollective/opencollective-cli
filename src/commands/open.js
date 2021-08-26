import open from 'open';
import { getCollective } from '../lib/utils';

const collective = getCollective();

if (!collective) {
  console.log("Usage: opencollective open <collective>");
  console.log("E.g. opencollective open webpack");
  process.exit(0);
}

console.log("Opening", collective.url);
open(collective.url);

process.exit(0);
