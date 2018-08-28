import fs from 'fs';
import path from 'path';
import { spawn, execSync, existsSync } from 'child_process';
import minimist from 'minimist';
import opn from 'opn';
import inquirer from 'inquirer';
import fetch from 'node-fetch';

import { debug, error, getPackageJSON, readJSONFile, getCollective } from '../lib/utils';
import { writeJSONFile } from '../lib/write';
import { updateReadme } from '../lib/updateReadme'; 
import { updateTemplate } from '../lib/updateTemplate'; 
import { addPostInstall } from '../lib/addPostInstall';

let projectPath = '.';
let org, repo;
let pkg;
let github_token;

const argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    interactive: 'i',
    repo: 'r',
    github_token: 'gt'
  }
});

if (argv.help) {
  const bin = path.resolve(__dirname, `./setup-help.js`);
  require(bin, 'may-exclude');
  process.exit(0);
}

const fork = (org, repo, github_token) => {
  return fetch(`https://api.github.com/repos/${org}/${repo}/forks?org=opencollective`, { method: 'POST', headers: { "Authorization": `token ${github_token}` }})
}

const submitPullRequest = (org, repo, projectPath, github_token) => {
  
  let body = `Hi, I'm making updates for Open Collective. Either you or a supporter signed this repo up for Open Collective. This pull request adds backers and sponsors from your Open Collective https://opencollective.com/${repo} ❤️
  
  It adds two badges at the top to show the latest number of backers and sponsors. It also adds placeholders so that the avatar/logo of new backers/sponsors can automatically be shown without having to update your README.md. [[more info](https://github.com/opencollective/opencollective/wiki/Github-banner)]. See how it looks on [this repo](https://github.com/apex/apex#backers).`;
  
  execSync(`git add README.md && git commit -m "Added backers and sponsors on the README" || exit 0`, { cwd: projectPath });
  if (pkg) {
    execSync(`git add package.json && git commit -m "Added call to donate after npm install (optional)" || exit 0`, { cwd: projectPath });
    body += `\nWe have also added a \`postinstall\` script to let people know after \`npm|yarn install\` that you are welcoming donations (optional). [[More info](https://github.com/OpenCollective/opencollective-cli)]`;
  }

  body += `\nYou can also add a "Donate" button to your website and automatically show your backers and sponsors there with our widgets. Have a look here: https://opencollective.com/widgets

  P.S: As with any pull request, feel free to comment or suggest changes. The only thing "required" are the placeholders on the README because we believe it's important to acknowledge the people in your community that are contributing (financially or with code!).

  Thank you for your great contribution to the open source community. You are awesome! 🙌
  And welcome to the open collective community! 😊

  Come chat with us in the #opensource channel on https://slack.opencollective.com - great place to ask questions and share best practices with other open source sustainers!
  `;

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

const loadProject = (argv) => {

  if (!argv.repo) return Promise.resolve();

  github_token = argv.github_token;

  const parts = argv.repo.split('/');
  org = parts[0];
  repo = parts[1];

  if (!github_token) {
    const configFile = readJSONFile(path.join(process.env.HOME, ".opencollective.json")) || {};
    github_token = configFile.github_token;

    if (!github_token) {
      console.log("You need a Github Token to do this.");
      console.log("Grab one on https://github.com/settings/tokens");
      console.log("");
      return inquirer.prompt([{
        type: "input",
        name: "github_token",
        message: "Github Token"
        }]).then(answers => {
          console.log("");
          github_token = answers.github_token;
          if (!github_token) {
            error("Github token missing. Get one on https://github.com/settings/tokens and pass it using the --github_token argument.");
            process.exit(0);          
          }
          if (github_token.length != 40) {
            error("Invalid Github Token (should be 40 chars long)");
            process.exit(0);
          }
          configFile.github_token = github_token;
          return writeJSONFile("~/.opencollective.json", configFile);
      })
    }
  }

  projectPath = path.join('/tmp', repo);
  const logsFile = path.join('/tmp', `${repo}.log`);

  return fork(org, repo, github_token)
    .then(() => {
      try {
        console.log(`Forking ${org}/${repo}`);
        execSync(`git clone --depth 1 git@github.com:opencollective/${repo}.git >> ${logsFile} 2>&1 && cd ${repo} && git checkout -b opencollective`, { cwd: path.resolve('/tmp') });
      } catch (e) {
        debug("error in git clone", e);
      }

      if (fs.existsSync(path.join(projectPath, "package.json"))) {
        pkg = getPackageJSON(projectPath);
        if (!pkg.dependencies || !pkg.dependencies.opencollective) {
          console.log("Running npm install --save opencollective-postinstall");
          return execSync(`npm install --save opencollective-postinstall >> ${logsFile} 2>&1`, { cwd: projectPath });
        }
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
      updateIssueTemplate: true,
      updateContributing: true,
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
        if(str.match(/^[a-zA-Z\-0-9_]+$/)) return true;
        else return "Please enter a valid slug (e.g. https://opencollective.com/webpack)";
      }
    },
    {
      type: "confirm",
      name: "updateContributing",
      default: true,
      message: "Update CONTRIBUTING.md?"
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
  const collective = { slug: answers.collectiveSlug.replace('.','') }; // defaults to `repo`

  updateReadme(path.join(projectPath, "README.md"), collective);
  if (pkg) {
    addPostInstall(path.join(projectPath, "package.json"), collective);
  }
  if (answers.updateIssueTemplate) {
    updateTemplate(path.join(projectPath, ".github", "ISSUE_TEMPLATE.md"), collective)
      .then(({newFile, filename}) => {
        const verb = newFile ? 'Added' : 'Updated';
        const msg = `${verb} .github/${filename} (optional)`;
        execSync(`git add .github/${filename} && git commit -m "${msg}" || exit 0`, { cwd: projectPath });
      });
  }
  if (answers.updatePullRequestTemplate) {
    updateTemplate(path.join(projectPath, ".github", "PULL_REQUEST_TEMPLATE.md"), collective)
      .then(({newFile, filename}) => {
        const verb = newFile ? 'Added' : 'Updated';
        const msg = `${verb} .github/${filename} (optional)`;
        execSync(`git add .github/${filename} && git commit -m "${msg}" || exit 0`, { cwd: projectPath });
      });
  }
  if (answers.updateContributing) {
    updateTemplate(path.join(projectPath, "CONTRIBUTING.md"), collective)
      .then(({newFile, filename}) => {
        const verb = newFile ? 'Added' : 'Updated';
        const msg = `${verb} ${filename} (optional)`;
        execSync(`git add ${filename} && git commit -m "${msg}" || exit 0`, { cwd: projectPath });
      });
  }
  return;
}

console.log("");

loadProject(argv)
  .then(loadPackageJSON)
  .then(() => askQuestions(argv.interactive))
  .then(ProcessAnswers).catch(console.error)
  .then(() => {
    if (!argv.repo) return;
    if (!process.env.DEBUG && !argv.interactive) {
      // Make sure it had the time to write the files to disk
      // TODO: Turn the updateTemplate, updateReadme into promises to avoid this hack
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
      });
    }
    // if DEBUG or interactive mode, we ask for confirmation
    execSync(`open README.md`, { cwd: projectPath });
    return inquirer.prompt([{
      type: "confirm",
      name: "confirm",
      message: `Please double check the pull request (cd /tmp/${repo} && git status;)`,
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
