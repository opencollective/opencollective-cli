import chalk from 'chalk';
import { execSync } from 'child_process';

console.log(
  `
${chalk.bold(`opencollective`)} setup

  Setup a collective (from github or in current working directory)

${chalk.dim('Options:')}

  -i, --interactive               Interactive mode
  -r, --repo <org/repo>           Clone the repo, runs the setup in interactive mode and submits a pull request
  -gt, --github_token <token>     Authentication token from Github (see https://github.com/settings/tokens)
  -h, --help                      Output usage information

${chalk.dim('Additional commands:')}

  setup:readme [-f FILENAME]      Update the README FILENAME (defaults to README.md) with backers/sponsors badge and placeholders
  setup:template [-f FILENAME]    Prepend the default donate message to the template FILENAME (defaults to ISSUE_TEMPLATE.md)
  setup:postinstall               Add "opencollective postinstall" as the postinstall script in package.json

${chalk.dim('Examples:')}

${chalk.gray('–')} Setup a github repo

    ${chalk.cyan('$ opencollective setup --repo mochajs/mocha')}

${chalk.gray('–')} Add backers/sponsors to your README

    ${chalk.cyan('$ opencollective setup:readme')}

${chalk.gray('–')} Add the donate message in the PULL_REQUEST_TEMPLATE.md of the project:

    ${chalk.cyan(`$ opencollective setup:template -f PULL_REQUEST_TEMPLATE.md`)}

`
);