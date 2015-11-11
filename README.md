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

This project was conceived to solve that. With the help of modern web technologies, the IPFS and IPNS protocols
and some optional cache servers, we can solve these problems and create a true universal platform which can act as:

- Discussion board
- Wiki
- File Sharing platform
- E-Learning platform

With security, control, reliability, rock solid stability, fully distributed architecture or, optionally, none of these!

## How

This system uses the IPFS protocol. The protocol takes care of distributing data in a safe and efficiently distributed way.

In a nutshell, it works like this:

- IPFS uses content based addressing, so each file or folder has an address calculated using an hash of the content
- IPFS is fully distributed, and safe, because anyone can verify some data actually matches the address
- IPFS is efficient because anyone that views some content caches it and helps redistribute it. Your machines however will never redistribute data you haven't viewed or downloaded
- IPNS associates an IPFS address to the address of a node, it works like a pointer to track data that changes over time
- This project's discovery and storage protocols are entirely based on IPNS and IPFS

__Data Storage:__ A user's profile, posts, votes, comments and all his other data is served by him and stored in his computer(s). Anyone that views his
content will cache it by default thus helping others to see his profile. That's why if hundreds of people open the profile page of some
guy, his computer won't be overwhelmed because the data will be passed from computer to computer and will be available unless _everyone that has a copy goes offline_. Even then, we thought about fully optional __Cache Servers__ to help. You can learn more about them below.

#### Control and Administration

Each user can create a board with any name. A board is identified like this: `@board-name`

That user's board is identified like this: `user-id@board-name`

This means that `user` created an __administration__ for the board __board-name__ and thus by visiting `user-id@board-name`
you will view the board according to the rules and administration of `user`.

All the __administration__'s data is stored in `user`'s profile.

When you post something, by default it goes to all the administrations, but you can also choose a _preferred administration_ to show your
support or decide in any way which administrations will receive it.
This way administrations can be ranked and communities can form. If you don't like the administration of your board,
you can just use a new one for browsing, prefer a new one in your posts or create your own administration.

__Administrations can be a lot more than filters:__

An administration can personalize almost everything in how content is viewed, what content is allowed (acting a filter), whitelists, blacklists, eventually even the CSS or Layout of the front page, post tags and a lot more.

`admin` is the administrator of the repo. He decides the rules.

You (the user) will be able to choose a main _administration_ for a board and then also include content from other administrations.

An administration can also instruct clients to include posts approved by other administrations, distributing administrative work and/or
aggregating more content.

To sum it up, an __administration__ can configure a board to be:

- completely open allowing _anything_ to be posted
- completely closed with a whitelist of people allowed to post
- having every post or comment be approved by the administration. Users can still view disapproved or not yet
judged content but it will be marked as such and will be hidden by default.
- moderated by a vote system similar to reddit (not sure about this as it's too easily exploited by bots)
- any sane combination of the above rules and probably even more

__Auto Moderator Proposal__: this is an idea of a system to automatically find potential moderators for a board.
It works like this: users can vote if a content should be approved before it actually gets approved or denied by
moderators. If a user's votes are really close to the moderators' actions, then he is a valid candidate.
If this gets implemented it should go in the Admin Node.

__About private boards__

They probably will be possible but are not included for now, because hidden content is far away in the IPFS roadmap.
Administrations can forbit people to write, but not to read.

__Important Note:__ due to how the system works, an _administration_'s rules and decisions are just _guidelines_ for your computer.
Your computer will always be able to choose what to see and what to hide, it just uses your administration's guidelines _by default_.

#### But isn't gathering all the data slow? What if a user goes offline?

That's why there are __Cache Servers__.
They monitor _administrations_ and cache all the content (or some of it) as soon as it becomes available on the network, making sure it never gets lost.
They are completely optional but they help out in serving the users.

Cache servers also act as gateways and provide an HTTP API to access the boards.

Also note that due to how IPFS works, the more popular some content gets, the _faster it downloads_ and the _easier it is for your computer to find it_. Censorship is impractical in such a system and data is almost impossible to take down. That's why IPFS is also called _the
permanent web_.

## Faq

#### Can I be anonymous?

What if someone monitors my IPFS node? Will they know what content I'm seeing and everything I post and link it to my IP?

__Yes, but there is a solution.__

You can access a Cache Server's HTTP(s) gateway via Tor for read only access to content.

To post while mantaining anonimity, you would need to run IPFS via Tor. This is probably not easily done at the moment but it is planned.

## Components

- __Client__
  - a static web application to access IPFS Boards
- __Cache Server__
  - can cache boards, helping to serve them via IPFS and optionally via an HTTP gateway to the static web application and the boards' data
- __Admin Node__
  - small service that allows an admin to outsource moderations to other users.

__Note:__ until the __IPFS Javascript Implementation__ is done:

- the client (a static web application) requires a full IPFS node because it needs to be able to discover content via the IPFS API.
- the cache server (written in node) requires a full IPFS node.

__Note:__ if you want to write data, your __IPNS__ needs to be taken over by the application. This problem will be addressed in the future

### Data Storage

Each user exposes via IPNS a folder containing:

- boards
  - _board name(s)_
    - settings.json - the board's settings
    - whitelist - contains links to all whitelisted users
    - blacklist - contains links to all blacklisted users
    - approved - contains links to all approved content
- posts
  - _board name(s)_
    - _post(s)_
- comments
  - _board name(s)_
    - _comment(s)_
- votes
  - _board name(s)_
    - _vote(s)_
- name - stores the user's screen name (also stored in profile?)
- profile.json - user's additional profile data
- ipfs-boards-version.txt - used to store compatibility information

#### Post

    {
      "title": "Title of the post",
      "date": "date of the post",
      "op": "id_of_the_original_poster",
      "preference": "id_of_the_preferred_administration",
      "text": "Content of the post"
    }

Optionally a post could have a `text-url` field so that crossposting is
possible for lange texts without duplicating data.

#### Comment

    {
      "parent": "id_of_the_parent_object",
      "date": "date of the comment"
      "preference": "id_of_the_preferred_administration",
      "op": "id_of_the_original_poster",
      "text": "Content of the post"
    }

#### Vote

    ipfs:boards:vote-for:object_url

#### Versioning

    just the version ID written in the version file

### License

GPLv3? MIT? Something else? Needs to be chosen
