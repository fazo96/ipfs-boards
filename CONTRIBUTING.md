## Setting up a developer environment

You'll need:

- __node and npm__: you can get these on Homebrew on OSX or in your Linux distro's repos
- __git__: you can get it just like node and npm
- __webpack and webpack-dev-server__: you can get them by running `npm install -g webpack webpack-dev-server`. It might require super user privileges
- __go-ipfs__: you can get it like git and node, but not always, you may need to follow its istructions on its repo

1. Clone this repository and `cd` to its directory
1. run `npm install` to get dependences (there are many)

To fully use the app you'll need to have an IPFS daemon running. You can start one using `ipfs daemon`

You will also need to enable CORS on your IPFS daemon.
See the `ipfs_daemon_set_cors.sh` file (__Security Tip:__ don't run it before reading it!!!)

Now you can run:

- `npm run build` to build the webapp inside `webapp/dist/`
- `npm run serve` to start a webserver that will serve you the app locally and automagically rebuild it if you change some files

__Note about writing code:__ webpack will refuse to compile your code if
it doesn't comply with [standard](https://github.com/feross/standard)
code guidelines, which were chosen for this project to have a consistent,
proven useful standard for code style. If you want to have code linting in your
text editor on IDE, look for a plugin that can run
[eslint](https://github.com/eslint/eslint).

Have fun!

### Contributing a pull request

Make sure your code compiles fine :)
