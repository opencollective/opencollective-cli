# opencollective-cli
[![Backers on Open Collective](https://opencollective.com/tipboxk/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/tipboxk/sponsors/badge.svg)](#sponsors) ![](https://ci.appveyor.com/api/projects/status/5mf75q34cpr74s53?svg=true)

Command Line Interface for Open Collective.

## Install

    $ npm install -g opencollective
    
This will populate a `opencollective` (and its shortcut `oc`) as a command line.

You can also add this as a dependency in your `package.json` to automatically show the `postinstall` donate message:

    $ npm install --save opencollective
    
Then run

    $ opencollective setup


## Commands

    $ opencollective [collective] [info|stats]
    
Shows the latest stats of the collective (number of contributors, number of backers, annual budget and current balance).

![](https://cl.ly/1n2u281p2o1k/Screen%20Shot%202017-05-01%20at%204.41.58%20PM.png)

    $ opencollective [collective] donate [amount] [frequency]

Opens the donate page of your collective. E.g. $ opencollective webpack donate 5 monthly

    $ opencollective postinstall [--plain]
    
Reads the details of your collective in the `package.json` of the current directory and invite the user to donate after installing your package.
Add this command in the `postinstall` script of your `package.json`.

![](https://cl.ly/0u2a0z0Y3X37/Screen%20Shot%202017-03-24%20at%202.37.46%20PM.png)

If you add the `--plain` option, it won't show any emoji and ascii art (better for old terminals).

    $ opencollective setup

Interactive setup to add your collective info into your `package.json` and add the backers/sponsors badge and avatars in your `README.md`.


## Coming soon

    $ opencollective login
    
    $ opencollective logout
    
    $ opencollective cc | billing
    
    $ opencollective cc ls
    $ opencollective cc add
    $ opencollective cc rm
    
    $ opencollective apply [github_repo_url]
    
    $ opencollective show <collective>
    $ opencollective open <collective>
    
    $ opencollective ls // list the collectives you are contributing to.

    
Stop your contribution to <collective>. Warning: may make someone sad somewhere on this planet.

## Credits

Shamelessly inspired by the excellent [now-cli](https://github.com/zeit/now-cli)

## Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/tipboxk#backer)]

<a href="https://opencollective.com/tipboxk/backer/0/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/1/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/2/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/3/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/4/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/5/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/6/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/7/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/8/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/9/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/10/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/11/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/12/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/13/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/14/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/15/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/16/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/17/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/18/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/19/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/20/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/21/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/22/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/23/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/24/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/25/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/26/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/27/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/28/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/backer/29/website" target="_blank"><img src="https://opencollective.com/tipboxk/backer/29/avatar.svg"></a>


## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/tipboxk#sponsor)]

<a href="https://opencollective.com/tipboxk/sponsor/0/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/1/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/2/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/3/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/4/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/5/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/6/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/7/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/8/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/tipboxk/sponsor/9/website" target="_blank"><img src="https://opencollective.com/tipboxk/sponsor/9/avatar.svg"></a>


