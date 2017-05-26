import path from 'path';
import fs from 'fs';
import { debug, error } from '../lib/utils';
import detectIndent from 'detect-indent';

export function addPostInstall(projectPackageJSON, collective, options) {

  const file = fs.readFileSync(projectPackageJSON, "utf8");
  const indent = detectIndent(file).indent || '  ';
  const pkg = JSON.parse(file);
  if (!pkg) {
    console.log("Cannot load the `package.json` of your project");
    console.log("Please make sure you are running `opencollective postinstall` from the root directory of your project.")
    console.log("");
    return;
  } else if(pkg.scripts && pkg.scripts.postinstall && pkg.scripts.postinstall.match(/opencollective postinstall/)) {
    debug("Open Collective postinstall already configured 👌");
    return;
  }

  console.log("> Updating your package.json");
  pkg.collective = {
    type: "opencollective",
    url: "https://opencollective.com/" + collective.slug
  }
  const logo = collective.logo || options.logo || options.showLogo;

  if (logo) {
    pkg.collective.logo = logo;
  } else {
    delete pkg.collective.logo;
  }
  var postinstall = "opencollective postinstall";
  pkg.scripts = pkg.scripts || {};
  if (pkg.scripts.postinstall && pkg.scripts.postinstall.indexOf(postinstall) === -1) {
    pkg.scripts.postinstall = pkg.scripts.postinstall + " && " + postinstall;
  } else {
    pkg.scripts.postinstall = postinstall;
  }
  if (!pkg.dependencies || !pkg.dependencies.opencollective) {
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies.opencollective = "^1.0.3";
  }
  debug("Writing to package.json", { collective: pkg.collective, scripts: pkg.scripts });
  return fs.writeFileSync(projectPackageJSON, JSON.stringify(pkg, null, indent), "utf8");
}
