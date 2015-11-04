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
  - What if I want to write a custom client?
  - What if I want to change the user interface?
  - What if I want a name that someone else already has?
  - What if I want to move my data to another service/subreddit/forum ?
  - What if I want more control (think a private forum), or less control (think 4chan) ?
  - What if I want <feature> ?

This project was conceived to solve that. With the help of modern web technologies, the IPFS and IPNS protocols
and some optional cache servers, we can solve these problems and create a true universal platform which can act as:

- Discussion board
- Wiki
- File Sharing platform
- E-Learning platform

With security, control, reliability, rock solid stability, fully distributed architecture or, optionally, none of these!

## How

To be continued...

## Faq

To be continued...

## Components

- __Client__
  - a static web application to access IPFS Boards
- __Cache Server__
  - can cache boards, helping to serve them via IPFS and via an HTTP gateway to the static web application and the boards' data

__Note:__ until the __IPFS Javascript Implementation__ is done:

- the client (a static web application) requires a full IPFS node because it needs to be able to discover content via the IPFS API.
- the cache server (written in node) requires a full IPFS node.

__Note:__ if you want to write data, your __IPNS__ needs to be taken over by the application. This problem will be addressed in the future

### Data Storage

Each user exposes via IPNS a folder containing:

- boards
  - _board name(s)_
- posts
  - _board name(s)_
    - _admin name(s)_
      - _post(s)_
- comments
  - _board name(s)_
    - _admin name(s)_
      - _comment(s)_
- votes
  - _board name(s)_
    - _admin name(s)_
      - _vote(s)_
- compatibility: could be used to store compatibility information

#### Post

    {
      "title": "Title of the post",
      "date": "date of the post",
      "text": "Content of the post"
    }

Optionally a post could have a `text-url` field so that crossposting is
possible for lange texts without duplicating data.

#### Comment

    Comment text

#### Vote

    ipfs-board:vote-for:object_url

### Versioning

a `version` file or something should be included in the user's files to ensure compatibility between different
versions or forks.

### License

GPLv3? MIT? Something else? Needs to be chosen
