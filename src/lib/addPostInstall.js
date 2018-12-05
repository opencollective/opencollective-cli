import path from 'path';
import fs from 'fs';
import { debug, error, readJSONFile } from '../lib/utils';
import { writeJSONFile } from '../lib/write';

export function addPostInstall(projectPackageJSON, collective) {

  const pkg = readJSONFile(projectPackageJSON);
  if (!pkg) {
    console.log("Cannot load the `package.json` of your project");
    console.log("Please make sure you are running `opencollective-postinstall` from the root directory of your project.")
    console.log("");
    return;
  } else if(pkg.scripts && pkg.scripts.postinstall && pkg.scripts.postinstall.match(/opencollective-postinstall/)) {
    debug("Open Collective postinstall already configured 👌");
    return;
  }

  console.log("> Updating your package.json");
  pkg.collective = {
    type: "opencollective",
    url: "https://opencollective.com/" + collective.slug
  }
  
  var postinstall = "opencollective-postinstall";
  pkg.scripts = pkg.scripts || {};
  if (pkg.scripts.postinstall && pkg.scripts.postinstall.indexOf(postinstall) === -1) {
    pkg.scripts.postinstall = pkg.scripts.postinstall + " && " + postinstall;
  } else {
    pkg.scripts.postinstall = postinstall;
  }
  if (!pkg.dependencies || !pkg.dependencies['opencollective-postinstall']) {
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies['opencollective-postinstall'] = "^2.0.0";
  }
  debug("Writing to package.json", { collective: pkg.collective, scripts: pkg.scripts });
  return writeJSONFile(projectPackageJSON, pkg);
}
