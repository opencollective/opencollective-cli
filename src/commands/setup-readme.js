import { getArgs, getCollective } from '../lib/utils';
import { updateReadme } from '../lib/updateReadme';
import path from 'path';

const collective = getCollective();
const argv = getArgs();

updateReadme(path.join(process.cwd(), argv.file || "README.md"), collective);