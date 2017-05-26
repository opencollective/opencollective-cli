import fs from 'fs';
import path from 'path';
import { spawn, execSync, existsSync } from 'child_process';
import minimist from 'minimist';
import opn from 'opn';
import inquirer from 'inquirer';
import fetch from 'node-fetch';

import { debug, error, getPackageJSON, getCollective } from '../lib/utils';
import { fetchLogo } from "../lib/fetchData";
import { printLogo } from "../lib/print";
import { updateReadme } from '../lib/updateReadme'; 
import { updateTemplate } from '../lib/updateTemplate'; 
import { addPostInstall } from '../lib/addPostInstall';

let projectPath = '.';
let org, repo;
let pkg;

const argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    interactive: 'i',
    repo: 'r',
    github_token: 'gt'
  }
});

let github_token = argv.github_token;

if (argv.help) {
  const bin = path.resolve(__dirname, `./setup-help.js`);
  require(bin, 'may-exclude');
  process.exit(0);
}

console.log("")

const fork = (org, repo, github_token) => {
  return fetch(`https://api.github.com/repos/${org}/${repo}/forks?org=opencollective`, { method: 'POST', headers: { "Authorization": `token ${github_token}` }})
}

const submitPullRequest = (org, repo, projectPath, github_token) => {
  
  let body = `This pull request adds backers and sponsors from your Open Collective https://opencollective.com/${repo} ❤️\n\nIt adds two badges at the top to show the latest number of backers and sponsors. It also adds placeholders so that the avatar/logo of new backers/sponsors can automatically be shown without having to update your README.md. [[more info](https://github.com/opencollective/opencollective/wiki/Github-banner)]\n\nSee how it looks on [this repo](https://github.com/apex/apex#backers).\n`;

  execSync(`git add README.md && git commit -m "Added backers and sponsors on the README" || exit 0`, { cwd: projectPath });
  if (pkg) {
    execSync(`git add package.json && git commit -m "Added call to donate after npm install" || exit 0`, { cwd: projectPath });
    body += `\nWe have also added a \`postinstall\` script to let people know after \`npm|yarn install\` that you are welcoming donations. [[More info](https://github.com/OpenCollective/opencollective-cli)]`;
  }
  execSync(`git add .github/* && git commit -m "Added template for new issue" || exit 0`, { cwd: projectPath });

  execSync("git push origin opencollective", { cwd: projectPath });
  const data = {
    title: "Activating Open Collective",
    body,
    head: "opencollective:opencollective",
    base: "master"
  }

  return fetch(`https://api.github.com/repos/${org}/${repo}/pulls`, { method: 'POST', headers: {'Authorization': `token ${github_token}`}, body: JSON.stringify(data) })
    .then(res => res.json())
    .then(json => json.html_url);
}

const clean = (repo) => {
  if (!repo) return;
  execSync(`rm -rf ${repo}`, { cwd: path.resolve('/tmp') })
}

const loadProject = () => {

  if (!argv.repo) return Promise.resolve();

  const parts = argv.repo.split('/');
  org = parts[0];
  repo = parts[1];

  if (!github_token) {
    let configFile;
    try {
      configFile = fs.readFileSync(path.join(process.env.HOME, ".opencollective.json"));
      const config = JSON.parse(configFile);
      github_token = config.github_token;
    } catch (e) {
      debug("Cannot read ~/.opencollective.json", e);
    }

    if (!github_token) {
      error("Github token missing. Get one one https://github.com/settings/tokens and pass it using the --github_token argument.");
      process.exit(0);
    }
  }

  projectPath = path.join('/tmp', repo);
  const logsFile = path.join('/tmp', `${repo}.log`);

  return fork(org, repo, github_token)
    .then(() => {
      try {
        execSync(`git clone --depth 1 git@github.com:opencollective/${repo}.git >> ${logsFile} 2>&1 && cd ${repo} && git checkout -b opencollective`, { cwd: path.resolve('/tmp') });
      } catch (e) {
        debug("error in git clone", e);
      }

      if (fs.existsSync(path.join(projectPath, "package.json"))) {
        pkg = getPackageJSON(projectPath);
        console.log("Running npm install --save opencollective");
        return execSync(`npm install --save opencollective >> ${logsFile} 2>&1`, { cwd: projectPath });
      }
    });
}

const loadPackageJSON = () => {

  pkg = getPackageJSON(projectPath);

  if (!pkg) {
    debug("Cannot load the `package.json` of your project");
    return null;
  } else if(pkg.collective && pkg.collective.url) {
    debug("Open Collective already configured 👌");
    process.exit(0);
  }
  
}

const askQuestions = function(interactive) {

  if (!interactive || process.env.OC_POSTINSTALL_TEST) {
    return {
      collectiveSlug: repo || pkg.name,
      logo: "https://opencollective.com/opencollective/logo.txt",
      updateIssueTemplate: true,
      updatePullRequestTemplate: false
    };
  }

  const questions = [
    {
      type: "input",
      name: "collectiveSlug",
      message: "Enter the slug of your collective (https://opencollective.com/:slug)",
      default: repo || pkg.name,
      validate: function(str) {
        if(str.match(/^[a-zA-Z\-0-9]+$/)) return true;
        else return "Please enter a valid slug (e.g. https://opencollective.com/webpack)";
      }
    },
    {
      type: "list",
      name: "showLogo",
      message: "What logo should we use?",
      choices: function(answers) {
        return [
          { name: "Open Collective logo", value: "https://opencollective.com/opencollective/logo.txt" },
          { name: "The logo of your Collective (https://opencollective.com/" + answers.collectiveSlug + "/logo.txt)", value: "https://opencollective.com/" + answers.collectiveSlug + "/logo.txt" },
          { name: "Custom URL", value: "custom"},
          { name: "No logo", value: null }
        ];
      },
      when: () => (pkg)
    },
    {
      type: "input",
      name: "logo",
      message: "URL of your logo in ASCII art",
      default: function(answers) {
        "https://opencollective.com/" + answers.collectiveSlug + "/logo.txt"
      },
      validate: function(str) {
        if(str.match(/^https?:\/\/[^\/]+\/.+$/)) return true;
        else return "Please enter a valid url (e.g. https://opencollective.com/webpack/logo.txt)";
      },
      when: function(answers) {
        return (pkg && answers.showLogo === "custom");
      }
    },
    {
      type: "confirm",
      name: "updateIssueTemplate",
      default: true,
      message: "Update .github/ISSUE_TEMPLATE.md?"
    },
    {
      type: "confirm",
      name: "updatePullRequestTemplate",
      default: false,
      message: "Update .github/PULL_REQUEST_TEMPLATE.md?"
    }
  ];

  console.log("");
  return inquirer.prompt(questions).catch(function(e) {
    debug("Error while running the prompt", e);
    process.exit(0);
  });
}

const ProcessAnswers = function(answers) {
  const collective = { slug: answers.collectiveSlug }; // defaults to `repo`

  updateReadme(path.join(projectPath, "README.md"), collective);
  if (pkg) {
    addPostInstall(path.join(projectPath, "package.json"), collective, answers);
  }
  if (answers.updateIssueTemplate) {
    updateTemplate(path.join(projectPath, ".github", "ISSUE_TEMPLATE.md"), collective);
  }
  if (answers.updatePullRequestTemplate) {
    updateTemplate(path.join(projectPath, ".github", "PULL_REQUEST_TEMPLATE.md"), collective);
  }
  return;
}

console.log("");

loadProject()
  .then(loadPackageJSON)
  .then(() => askQuestions(argv.interactive))
  .then(ProcessAnswers).catch(console.error)
  .then(() => {
    if (!argv.repo) return;
    if (!process.env.DEBUG) {
      // Make sure it had the time to write the files to disk
      // TODO: Turn the updateTemplate, updateReadme into promises to avoid this hack
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
      });
    }
    // if DEBUG, we ask for confirmation
    execSync(`open README.md`, { cwd: projectPath });
    return inquirer.prompt([{
      type: "confirm",
      name: "confirm",
      message: "Please double check the pull request",
      default: true
    }]).catch(console.error)
  })
  .then(answers => {
      if (argv.repo && (!answers || answers.confirm)) {
        return submitPullRequest(org, repo, projectPath, github_token);
      }
  })
  .then(pullRequestUrl => {
    if (pullRequestUrl) {
      console.log("");
      console.log("Pull request created: ", pullRequestUrl);
      clean(repo);
    } else {
      console.log("Done.");
    }
    console.log("");
    console.log("Please double check your new updated README.md to make sure everything looks 👌.");
    console.log("");
    console.log("Have a great day!");
    return process.exit(0);
  })
  .catch(function(e) {
    debug("Error while trying to fetch the open collective logo or running the prompt", e);
    process.exit(0)
  });
