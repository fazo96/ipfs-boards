# IPFS Board

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
      - _vote object(s)_

#### Post

    {
      "title": "Title of the post",
      "text": "Content of the post"
    }

#### Comment

    Comment text

#### Vote

    ipfs-board:vote-for:object_url
