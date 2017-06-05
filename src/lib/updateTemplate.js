import path from 'path';
import fs from 'fs';
import { debug, error, getArgs, getCollective } from '../lib/utils';
import { print } from '../lib/print';

export function updateTemplate(filepath, data) {

  return new Promise((resolve, reject) => {
    let template, projectTemplate, newFile = true;
    let templateFilename = path.basename(filepath);

    if (["CONTRIBUTING.md", "ISSUE_TEMPLATE.md", "PULL_REQUEST_TEMPLATE.md"].indexOf(templateFilename) === -1) {
      return error(`[-f FILE] must be CONTRIBUTING.md, ISSUE_TEMPLATE.md or PULL_REQUEST_TEMPLATE.md (defaults to ISSUE_TEMPLATE.md)`);
    }

    debug("filepath", filepath);
    debug("data", data);
    debug("mkdir", path.dirname(filepath));
    fs.mkdir(path.dirname(filepath), () => {
      try {
        projectTemplate = fs.readFileSync(filepath, "utf8");
      } catch (e) {
        debug(e);
        projectTemplate = projectTemplate || "";
      }

      if (projectTemplate.indexOf("https://opencollective.com/" + data.slug) !== -1) {
        const errormsg = `Looks like you already have Open Collective added to your ${templateFilename}`;
        error(errormsg);
        return reject(new Error(errormsg));
      }

      console.log(`> Updating ${templateFilename}`);

      // If there is already a project template (e.g. CONTRIBUTING.md), 
      // we see if there is a _APPEND version of the template (e.g. templates/CONTRIBUTING_APPEND.md)
      if (projectTemplate && projectTemplate.length > 0) {
        newFile = false;
        const append_template = templateFilename.replace('.md','_APPEND.md');
        const append_template_path = path.join(__dirname, `../templates/${append_template}`);
        if (fs.existsSync(append_template_path)) {
          templateFilename = append_template;
          projectTemplate += '\n';
        }
      }

      const templateFilepath = path.join(__dirname, `../templates/${templateFilename}`);
      template = fs.readFileSync(templateFilepath, "utf8");
      template = template.replace(/{{([^}]+)}}/g, (str, attr) => data[attr]);

      const lines = projectTemplate.split("\n");
      lines.push(template);
      debug(template);
      const fileContent = lines.join("\n").trim();
      fs.writeFile(filepath, fileContent, { encoding: "utf8" }, (err) => {
        if (err) return reject(err);
        return resolve({ newFile, content: fileContent, filepath, filename: path.basename(filepath) });
      });
    });
  });



}
