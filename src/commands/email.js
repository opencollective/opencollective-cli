import open from 'open';

const url = 'mailto:support@opencollective.com?subject=opencollective-cli%20support';
console.log("Opening", "mailto:support@opencollective.com");
open(url);

process.exit(0);
