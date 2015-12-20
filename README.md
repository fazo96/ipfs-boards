# IPFS Boards

The easy to use Social Platform that runs in modern web browsers but requires _no servers_ and
_no external applications_ to work.

This Application aims to allow users to:

- __Share Data__ with the world, in a distributed and permanent way, whether it is documents, media, posts or files and folders
- __Discover__ other user's content by visiting a link to their profiles, and then seeding the content they like the most
- __Connect__ with other people, building communities and merging boards.

All of these in a fully distributed way: servers help by seeding content, but they are not necessary for the application to work.

The App is being developed to be versatile: it will run in web browsers, and it will bundle a viewer that will understand and display
_any file or folder_ already hosted via IPFS, with a nice user interface and optionally social features on top.

![Board view screenshot](https://ipfs.pics/ipfs/QmezECALggzJLK89j4hhDVPwVv5gzmZMLbYi8zbjpXWvVH)

This is how the Board view looks in the current prototype. You can see that markdown syntax is supported in all text bodies,
and the administrator name `fazo96` and also the other allowed posters,
in this case only one. Posts are shown in chronological order, but other sorting methods are planned.

![Post view screenshot](https://ipfs.pics/ipfs/QmZntzNLyRgTPfaNhc4B23AWKQxPcwmjjBv3WPMh78ieeQ)

This is the Post view with reddit style comments.

__Most mentioned functionality is already implemented and a lot more is coming :)__

## Why

Discussion boards, forums and other social platforms have many problems:

- __Centralized__
  - What if it gets shut down?
  - What if the servers are down?

- __Fragile__
  - What if there's a DoS attack?
  - What if there is a usage explosion and the servers can't handle it?
  - What if the datacenter is flooded and data is lost?

- __Limited__
  - What if you want new functionality or restore old features?
  - What if you want to build custom clients or extensions to the service?
  - What if you want to use it in a Local Network with no Internet access and no servers?
  - What if you want to do more than what the service was designed for, or truly be in control of your data?

This project was conceived to solve that. With the help of:

- the [IPFS](https://github.com/ipfs/ipfs) and IPNS protocols for efficient distributed data storage
- IPLD and [POST](https://github.com/ipfs/POST) protocols for a common, universal data structure
- Modern browsers and web technologies for a portable, accessible user interface

We can solve these problems and create a _truly universal social platform_ which can act as:

- Discussion board, like reddit or 4chan
- Blog with dynamic comments
- Wiki
- File Sharing platform, like dropbox.
- Forum
- (Maybe) E-Learning platform

With security, control, reliability, rock solid stability, fully distributed
architecture or, _optionally_, none of these!

## Get Started

__The App is not ready yet__, but you're welcome to take a look at the prototype,
even though it has limited functionality and is cumbersome to set up at the
moment.

Also keep in mind that due to issues with the current implementation of IPNS in
go-ipfs, real world usage of the prototype is very limited. This will all be
sorted out as soon as go-ipfs' next version, 0.4, is out.

If you want to really use the prototype, you can take a look at `CONTRIBUTING.md`
to set up a developer environment and try it out.

__Note about current status:__ almost every feature is _not_ optimized, _not_
efficient, but almost all solutions to current problems are already well defined,
frozen, and being developed, _expecially_ regarding __IPFS__.

__Note about short term future:__ after `go-iofs 0.4` comes out, a public demo will be available and you'll
just have to open a link to try the app!

__Note about long term future:__ a javascript implementation of IPFS is in progress. As soon as it's done, you will not need
go-ipfs anymore and this application will truly run in the browser without external dependencies.

## FAQ

See `FAQ.md`

If you have any questions not already answered, please open an issue and
consider contributing to the documentation and FAQs.

### How does it work?

See `PROTOCOL.md`

### How do I set up a development environment and contribute?

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
