## Setting up a developer environment

You'll need:

- __node and npm__: you can get these on Homebrew on OSX or in your Linux distro's repos
- __git__: you can get it just like node and npm
- __gulp__: you can get it by running `npm install -g gulp`. It might require super user privileges
- __go-ipfs__: you can get it like git and node, but not always, you may need to follow its istructions on its repo

1. Clone this repository and `cd` to its directory
1. run `npm install` to get dependences (there are many)

To use the app you'll need to have an IPFS daemon running. You can start one using `ipfs daemon`

You will also need to enable CORS on your IPFS daemon. See or run the `ipfs_daemon_set_cors.sh` file

Now you can run:

- `gulp` to build the webapp inside `webapp/dist/`
- `gulp serve` to start a webserver that will serve you the app and rebuild it if you change some files

Have fun!
