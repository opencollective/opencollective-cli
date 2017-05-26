import { getArgs, getCollective } from '../lib/utils';
import { updateTemplate } from '../lib/updateTemplate';
import path from 'path';

const collective = getCollective();
const argv = getArgs();

updateTemplate(path.join(process.cwd(), ".github", argv.file || "ISSUE_TEMPLATE.md"), { slug: collective.slug });