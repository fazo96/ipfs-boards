# IPFS Boards

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

The protocol should be versioning once it's stable enough to be useful
