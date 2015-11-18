# IPFS Boards

Image and discussion boards, forums and the like have many problems:

- Centralized
  - What if it gets shut down?
  - What if the servers are down?
  - What if a phisical network link breaks and the data is on the other side?
  - What if the owners of the board get eaten by aliens?

- Fragile
  - what if there's a DoS attack?
  - what if there is a usage explosion and the servers can't handle it?
  - what if the datacenter is flooded and data is lost?

- Closed Down, limited in possibilities
  - What if I want to write a custom client and there is no API?
  - What if I want to change the user interface?
  - What if I want to use it in a LAN with no Internet access?
  - What if I want a name that someone else already has?
  - What if I want to move my data to another service/subreddit/forum ?
  - What if I want more control (think a private forum), or less control (think 4chan) ?
  - What if I want <feature> ?

- Costs
  - What if I want to reduce costs of my cloud application?

This project was conceived to solve that. With the help of modern web technologies, the IPFS and IPNS protocols
and some optional cache servers, we can solve these problems and create a true universal platform which can act as:

- Discussion board, like reddit or 4chan
- Blog with dynamic comments
- Wiki
- File Sharing platform
- (Maybe) Forum (not sure because it would require some changes, but maybe)
- (Maybe) E-Learning platform

With security, control, reliability, rock solid stability, fully distributed
architecture or, optionally, none of these!

## FAQ

See `FAQ.md`

### How does it work?

See `PROTOCOL.md`

## Demo / Prototype

You can find a working build [here](http://ipfs.io/ipfs/Qmf4Lwb9EJn5hRc2h87ViLQq9zZcy1DPsUNGJCewST7yfN).

You need a local instance of go-ipfs running for it to work. You also need to set
CORS settings right or it won't work. However, in that case, it will complain to
you and provide instructions.

Keep in mind that it's a _very early_ prototype, nothing is finished, nothing
is polished, but something works. It's also probably full of security holes,
very inefficient, slow, etc. You're welcome to help in any way though!

Also, remember that __it doesn't have__:

- Ability to post and create a profile from the web app (it's read only for now)
- Aggregation (only the admin can post, for now)
- Advanced customization, control, user profile customization
- Media support
- Votes
- Comments
- Actually nice user interface
- Ability to run without a full IPFS node. That would require either a backend or the (currently not done) js implementation of IPFS

Ability to publish stuff in the browser won't be implemented until go-ipfs 0.4
is ready. It will maybe be ready before the new year.
You will be able to publish your boards/profile/posts using a CLI though.

### How do I set up a development environment?

See `HACKING.md`

## Components

- __Client__
  - a static web application to access IPFS Boards
  - maybe a desktop version (which would be a wrapped web application)
  - will be able to do everything in a simple browser
- __Server__
  - __Completely Optional__ (not right now, but it will be)
  - can cache content so that it doesn't get lost
  - fully configurable
  - can serve the Client
  - can render the client application so that search engines can index content
  - can provide content over an HTTP API or web sockets so that devices can save bandwidth

__Note:__ until the __IPFS Javascript Implementation__ is done:

- the client (a static web application) requires a full IPFS node because it needs to be able to discover content via the IPFS API.
- the cache server (written in node) requires a full IPFS node.

__Note:__ if you want to write data, your __IPNS__ needs to be taken over
by the application. This problem will be solved after go-ipfs 0.4 with the files
API is released.

### License

    IPFS Boards
    Copyright (C) 2015 Enrico Fasoli

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
