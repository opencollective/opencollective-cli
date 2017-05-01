# Open Collective

Official node module for Open Collective.

    $ opencollective postinstall [--plain]
    
Reads the details of your collective in your `package.json` and invite the user to donate after installing your package.

    $ opencollective setup
    
Interactive setup to add your collective info into your `package.json` and add the backers/sponsors badge and avatars in your `README.md`.

    $ opencollective [collective] donate [amount] [frequency]

Opens the donate page of your collective. E.g. $ opencollective webpack donate 5 monthly

    $ open collective [collective] info|stats
    
Shows the latest stats of the collective (number of contributors, number of backers, annual budget and current balance).

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