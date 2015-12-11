# IPFS Boards

The easy to use Discussion Board platform that runs in modern web browsers but requires _no servers_ and
_no external applications_ to work.

![Board view screenshot](https://ipfs.pics/ipfs/QmezECALggzJLK89j4hhDVPwVv5gzmZMLbYi8zbjpXWvVH)

This is how the Board view looks at the moment. You can see that markdown syntax is supported in all text bodies,
and the administrator name `fazo96` and also the other allowed posters, in this case only one. Posts are shown in chronological order, but other sorting methods are planned.

![Post view screenshot](https://ipfs.pics/ipfs/QmZntzNLyRgTPfaNhc4B23AWKQxPcwmjjBv3WPMh78ieeQ)

This is the Post view with reddit style comments.

All functionality shown in the screenshot is already implemented and content is downloaded from IPFS.

## Why

Image and discussion boards, forums and the like have many problems:

- Centralized
  - What if it gets shut down?
  - What if the servers are down?

- Fragile
  - What if there's a DoS attack?
  - What if there is a usage explosion and the servers can't handle it?
  - What if the datacenter is flooded and data is lost?

- Limited
  - What if you want new functionality or restore old features?
  - What if you want to build custom clients or extensions to the service?
  - What if you want to use it in a Local Network with no Internet access and no servers?
  - What if you want to do more than what the service was designed for, or truly be in control of your data?

This project was conceived to solve that. With the help of:

- the [IPFS](https://github.com/ipfs/ipfs) and IPNS protocols for efficient distributed data storage
- IPLD and [POST](https://github.com/ipfs/POST) protocols for a common, universal data structure
- Modern browsers and web technologies for a portable, accessible user interface

We can solve these problems and create a true universal platform which can act as:

- Discussion board, like reddit or 4chan
- Blog with dynamic comments
- Wiki
- File Sharing platform
- Forum
- (Maybe) E-Learning platform

With security, control, reliability, rock solid stability, fully distributed
architecture or, optionally, none of these!

## Get Started

The App is not ready yet, but you're welcome to take a look at the prototype,
even though it only has informational pages and very limited functionality.

Also keep in mind that due to issues with the current implementation of IPNS in
go-ipfs, real world usage of the prototype is very limited. This will all be
sorted out as soon as go-ipfs' next version, 0.4, is out.

You can take a look at the prototype [here](http://ipfs.io/ipfs/QmPmqUP5bYUme6V45n4BzPTp6BM1wwX2nGsh5ttpC5qg1C)
but you won't be able to actually use it.

If you want to really use the prototype, you can quickly set up your machine like this:

1. get `go-ipfs` installed on your OSX or GNU/Linux system
1. run this in a terminal `API_ORIGIN="localhost:8080" ipfs daemon`
1. open [this](http://localhost:8080/ipfs/QmPmqUP5bYUme6V45n4BzPTp6BM1wwX2nGsh5ttpC5qg1C) in your browser
1. You're all set!

__Note:__ a javascript implementation of IPFS is in progress. As soon as it's done, you will not need
go-ipfs anymore and this application will truly run in the browser without external dependencies.

### Additional information

You need a local instance of go-ipfs running for it to work. You also need to set
CORS settings right or it won't work. However, in that case, it will complain to
you and provide instructions.

Keep in mind that it's a _very early_ prototype, nothing is finished, nothing
is polished, but something works. It's also probably full of security holes,
very inefficient, slow, etc. You're welcome to help in any way though!

Also, remember that __it doesn't have__:

- Ability to post and create a profile from the web app (it's read only for now)
- Aggregation (it's quite limited for now)
- Advanced customization, control, user profile customization
- Media support
- Votes
- Ability to run without a full IPFS node. That would require either a Backend or the (currently not done) js implementation of IPFS

Ability to publish stuff in the browser won't be implemented until go-ipfs 0.4
is ready. It will maybe be ready before the new year.
You will be able to publish your boards/profile/posts using a CLI though.

## FAQ

See `FAQ.md`

### How does it work?

See `PROTOCOL.md`

### How do I set up a development environment?

See `CONTRIBUTING.md`

## Components

- __Client__
  - a static web application to access IPFS Boards
  - work in progress, some features are already done, see above
  - maybe a desktop version (which would be the wrapped web application, using Electron)
  - will be able to do everything in any modern browser
- __Cache Server and/or Backend__
  - __Not started yet__: no code has been written yet!
  - __Completely Optional__: you don't need this to be able to use the App
  - automagically caches content 24/7 so that it's always available
  - fully configurable, for example only cache content from users you want to support.
  - can serve data via HTTP API
  - can render the client application so that search engines can index content
  - can provide content over an HTTP API or web sockets so that devices can save bandwidth
- __[go-ipfs](https://github.com/ipfs/go-ipfs)__
  - needed to use the app until [js-ipfs](https://github.com/ipfs/js-ipfs) is ready!

__Note:__ until the __IPFS Javascript Implementation__ is done:

- the client (a static web application) requires a full IPFS node because it needs to be able to discover content via the IPFS API.
- the cache server (written in node) requires go-ipfs.

### License

  The MIT License (MIT)

  Copyright (c) 2015 Enrico Fasoli (fazo96)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
