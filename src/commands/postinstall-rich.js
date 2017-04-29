import minimist from 'minimist';

import { debug, getCollective, padding } from '../lib/utils';
import { printLogo, printFooter, printStats} from '../lib/print';
import { fetchStats, fetchLogo } from '../lib/fetchData';

const argv = minimist(process.argv.slice(2), {
  alias: {
    collective: 'c',
    logo: 'l',
    help: 'h'
  }
});

const collective = getCollective();
collective.logo = argv.logo || process.env.npm_package_collective_logo;

function init() {
  const promises = [];
  promises.push(fetchStats(collective.url));
  if (collective.logo) {
    promises.push(fetchLogo(collective.logo));
  }

  Promise.all(promises)
    .then(function(results) {
      collective.stats = results[0];
      const logotxt = results[1];

      if (logotxt) {
        printLogo(logotxt);
      }
      printFooter(collective);
      process.exit(0);     
    })
    .catch(function(e) {
      console.error("Error caught: ", e);
      printFooter();
      process.exit(0);
    })
}

debug("process.env", process.env);
if (collective.url) {
  init();
} else {
  console.log("Usage: opencollective postinstall --collective=webpack");
  process.exit(0);
}