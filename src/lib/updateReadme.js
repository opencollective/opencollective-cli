import path from 'path';
import fs from 'fs';
import { error, debug, detectBadge } from '../lib/utils';

export function updateReadme(filepath, collective) {

  const templateFile = path.join(__dirname, "../templates/README.md");

  const badgesmd = "[![Backers on Open Collective](https://opencollective.com/" + collective.slug + "/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/" + collective.slug + "/sponsors/badge.svg)](#sponsors)";
  const badgeshtml = "<a href=\"#backers\" alt=\"sponsors on Open Collective\"><img src=\"https://opencollective.com/" + collective.slug + "/backers/badge.svg\" /></a> <a href=\"#sponsors\" alt=\"Sponsors on Open Collective\"><img src=\"https://opencollective.com/" + collective.slug + "/sponsors/badge.svg\" /></a>";

  let readme;
  try {
    readme = fs.readFileSync(filepath, "utf8");
  } catch(e) {
    console.log("> Unable to open your README.md file");
    debug(e);
    return Promise.reject(e);
  }

  if (readme.indexOf("https://opencollective.com/" + collective.slug + "/backers/badge.svg") !== -1) {
    error("Looks like you already have Open Collective added to your README.md");
    return Promise.reject(new Error("Open Collective already added in README.md"));
  }


  let template;
  try {
    template = fs.readFileSync(templateFile, "utf8");
  } catch (e) {
    debug(e);
    return Promise.reject(e);
  }

  const placeholders = template.replace(/{{([^}]+)}}/g, (str, attr) => collective[attr]);

  const lines = readme.split("\n");
  const newLines = [];

  var firstBadgeDetected = false, placeholdersPlaced = false;
  lines.forEach(function(line) {
    if (!firstBadgeDetected && detectBadge(line)) {
      firstBadgeDetected = true;
      if (line.match(/<img src/i)) {
        line = line.replace(/<img src/i, `${badgeshtml} <img src`);
      } else {
        line = line.replace(/(\[!|\!\[)/i, `${badgesmd} $1`);
      }
    }

    // We place the placeholders just above the license section if any
    if (!placeholdersPlaced) {
      if (line.match(/^#+.*License.*/i)) {
        newLines.push(placeholders);
        placeholdersPlaced = true;
      }
    }
    newLines.push(line);
  })

  if (!placeholdersPlaced) {
    newLines.push(placeholders);
  }

  readme = newLines.join("\n");
  console.log("> Adding badges and placeholders for backers and sponsors on your README.md");
  try {
    fs.writeFileSync(filepath, readme, "utf8");
    return Promise.resolve(readme);
  } catch(e) {
    return Promise.reject(e);
  }
}