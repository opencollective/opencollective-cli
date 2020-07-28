import fs from 'fs';
import chalk from 'chalk';
import minimist from 'minimist';
import path from 'path';
import { print } from './print';

export function debug() {
  if (process.env.DEBUG) {
    console.log.apply(this, arguments);
  }
}

export function error(msg) {
  console.log("");
  print(msg, { cols: msg.length });
  console.log("");
  print("¯\\_(ツ)_/¯", { cols: msg.length });
  console.log("");  
}

export function isDevEnvironment() {
  if (process.env.OC_POSTINSTALL_TEST) return true;
  if (process.env.CI || process.env.CONTINUOUS_INTEGRATION) return false;
  return (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development');
}

export function isFancyEnvironment() {
  const npm_config_node_version = process.env.npm_config_node_version;
  return (isDevEnvironment() && process.stdout.isTTY && process.platform !== 'win32' && (!npm_config_node_version || parseInt(npm_config_node_version.substr(0,npm_config_node_version.indexOf('.')))) >= 5);
}

export function padding(length) {
  var padding = '';
  for (var i=0; i<length; i++) {
    padding += ' ';
  }
  return padding;
}

export function formatCurrency(amount, currency, precision) {
  precision = precision || 0;
  amount = amount/100; // converting cents

  return amount.toLocaleString(currency, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits : precision,
    maximumFractionDigits : precision
  });
}

export const argv = minimist(process.argv.slice(2), {
  alias: {
    collective: 'c',
    slug: 's',
    file: 'f',
    help: 'h',
    logo: 'l'
  }
});

export function detectBadge(line) {
  if (!line) return false;
  return (line.match(/badge.svg/) || line.match(/img.shields.io/) || line.match(/https?:\/\/badges?\./) || line.match(/https?:\/\/ci.appveyor/));
}

export function readJSONFile(file) {
  file = path.resolve(file.replace(/^~/, process.env.HOME));
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    debug("Unable to read JSON file ", file);
    debug(e);
  }
}

export function getPackageJSON(repoPath = '.') {
  const packageJSONPath = path.join(repoPath, './package.json');
  debug("Loading ", packageJSONPath);
  let pkg;
  try {
    return readJSONFile(packageJSONPath);
  } catch(e) {
    debug("error while trying to load ./package.json", "cwd:", process.cwd(), e);
    return null;
  }
}

export function getCollectiveSlug() {
  debug(">>> argv", argv);
  if (argv.collective) return argv.collective;
  if (argv.slug) return argv.slug;
  if (process.env.npm_package_name) return process.env.npm_package_name;
  if (argv._[0]) return argv._[0];
}

export function getCollective() {
  let pkg;
  const collective = {};
  collective.slug = getCollectiveSlug();
  if (!collective.slug) {
    pkg = getPackageJSON();
    if (pkg && pkg.collective && pkg.collective.url) {
      collective.slug = pkg.collective.url.substr(pkg.collective.url.lastIndexOf('/')+1).toLowerCase();
    } else {
      collective.slug = pkg.name;
    }
  }
  collective.url = process.env.npm_package_collective_url || `https://opencollective.com/${collective.slug}`;
  collective.logo = argv.logo || process.env.npm_package_collective_logo;

  if (!collective.logo) {
    pkg = pkg || getPackageJSON();
    if (pkg && pkg.collective) {
      collective.logo = pkg.collective.logo;
    }
  }

  debug(">>> collective", collective);
  return collective;
}

export function getArgs() {
  if (Object.keys(arguments).length === 0) return argv;
  const args = {};
  for (const i in arguments) {
    args[arguments[i]] = argv._[i];
  }
  debug(">>> args", args);
  return args;
}