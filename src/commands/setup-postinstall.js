import { getCollective } from '../lib/utils';
import { addPostInstall } from '../lib/addPostInstall';
import path from 'path';

const collective = getCollective();

addPostInstall(path.join(process.cwd(), "package.json"), collective)
