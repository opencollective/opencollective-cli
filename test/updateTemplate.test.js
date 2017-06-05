import path from 'path';
import { expect } from 'chai';
import { exec } from 'child_process';
import { updateTemplate } from '../src/lib/updateTemplate';

const paths = {
  'contributing': path.resolve('test/package/CONTRIBUTING.md'),
  'newContributing': path.resolve('test/parentpackage/CONTRIBUTING.md')
};

console.log("node version", process.version);

describe("updateTemplate.test.js", () => {

  after('rm CONTRIBUTING.md', (done) => exec(`rm ${paths.newContributing}`, done));
  after('clean', (done) => exec("npm run clean", done));

  it('creates a new CONTRIBUTING.md', () => updateTemplate(paths.newContributing, { slug: 'testcollective' }).then((result) => {
    expect(result.newFile).to.be.true;
    expect(result.filename).to.equal("CONTRIBUTING.md");
    expect(result.filepath).to.equal(paths.newContributing);
    expect(result.content).to.contain("## Submitting code");
    expect(result.content).to.contain("https://opencollective.com/testcollective/contributors.svg")
  }));

  it('appends to CONTRIBUTING.md', () => updateTemplate(paths.contributing, { slug: 'testcollective' }).then((result) => {
    expect(result.newFile).to.be.false;
    expect(result.filename).to.equal("CONTRIBUTING.md");
    expect(result.filepath).to.equal(paths.contributing);
    expect(result.content).to.not.contain("## Submitting code");
    expect(result.content).to.contain("https://opencollective.com/testcollective/contributors.svg")
  }));
});