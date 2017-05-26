import path from 'path';
import fs from 'fs';
import { debug, error, getArgs, getCollective } from '../lib/utils';
import { print } from '../lib/print';

export function updateTemplate(filepath, data) {

  let template, projectTemplate;

  const templateFilename = path.basename(filepath);

  if (["ISSUE_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"].indexOf(templateFilename) === -1) {
    return error(`[-f FILE] must be ISSUE_TEMPLATE.md or PULL_REQUEST_TEMPLATE.md (defaults to ISSUE_TEMPLATE.md)`);
  }

  const templateFilepath = path.join(__dirname, `../templates/${templateFilename}`);

  debug("filepath", filepath);
  debug("data", data);
  debug("mkdir", path.dirname(filepath));
  fs.mkdir(path.dirname(filepath), () => {
    try {
      template = fs.readFileSync(templateFilepath, "utf8");
      projectTemplate = fs.readFileSync(filepath, "utf8");
    } catch (e) {
      debug(e);
      projectTemplate = projectTemplate || "";
    }

    if (projectTemplate.indexOf("https://opencollective.com/" + data.slug) !== -1) {
      return error(`Looks like you already have Open Collective added to your ${templateFilename}`)
    }

    const lines = projectTemplate.split("\n");
    template = template.replace(/{{([^}]+)}}/g, (str, attr) => data[attr]);
    lines.push(template);
    console.log(`> Adding donate message to your ${templateFilename}`);
    debug(template);
    return fs.writeFileSync(filepath, lines.join("\n").trim(), "utf8");

  });

}
