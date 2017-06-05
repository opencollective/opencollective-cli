import fs from 'fs';
import path from 'path';
import detectIndent from 'detect-indent';

export function writeJSONFile(file, json) {
  file = path.resolve(file.replace(/^~/, process.env.HOME));
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(file, 'utf8');
  } catch (e) {}
  try {
    const indent = detectIndent(fileContent).indent || '  ';
    fs.writeFileSync(file, JSON.stringify(json, null, indent));
  } catch(e) {
    debug("Unable to write JSON file", file);
    debug(e);
  }
}
