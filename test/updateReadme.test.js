import path from 'path';
import { expect } from 'chai';
import { exec } from 'child_process';
import { updateReadme } from '../src/lib/updateReadme';

const paths = {
  'readme': path.resolve('test/package/README.md'),
};

describe("updateReadme.test.js", () => {

  after('clean', (done) => exec("npm run clean", done));

  it('updates the readme', (done) => {
    updateReadme(paths.readme, { slug: 'testcollective' }).then((readme) => {
      expect(readme).to.contain("https://opencollective.com/testcollective/backers/badge.svg")
      expect(readme).to.contain("https://opencollective.com/testcollective/sponsors/badge.svg")
      expect(readme).to.contain("https://opencollective.com/testcollective/sponsor/9/avatar.svg")
      expect(readme.indexOf("https://opencollective.com/testcollective/sponsor/9/avatar.svg") < readme.indexOf("## License")).to.be.true;
      done();
    })
    .catch(e => {
      expect(e).to.not.exist;
      console.log("Error:", e);
      done();
    });
  });
});