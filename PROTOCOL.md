# IPFS Boards Protocol

This system uses the IPFS protocol. The protocol takes care of distributing data in a safe and efficiently distributed way.

In a nutshell, it works like this:

- IPFS uses content based addressing, so each file or folder has an address calculated using an hash of the content
- IPFS is fully distributed, and safe, because anyone can verify some data actually matches the address
- IPFS is efficient because anyone that views some content caches it and helps redistribute it. Your machines however will never redistribute data you haven't viewed or downloaded
- IPNS associates an IPFS address to the address of a node, it works like a pointer to track data that changes over time
- IPNS publications are signed from the node matching the publication's actual address, so they can be trusted
- This project's discovery, storage and communications protocols are entirely based on IPNS and IPFS

__Data Storage:__ A user's profile, posts, votes, comments and all his other data is served by him and stored in his computer(s). Anyone that views his
content will cache it by default thus helping others to see his profile. That's why if hundreds of people open the profile page of some
guy, his computer won't be overwhelmed because the data will be passed from computer to computer and will be available unless _everyone that has a copy goes offline_. Even then, we thought about fully optional __Cache Servers__ to help. You can learn more about them below.

### Data Storage

Each user exposes a folder called `ipfs-boards-profile` in the root of the IPNS
publication, containing:

- boards
  - _board name(s)_
    - settings.json - the board's settings
    - whitelist - contains links to all whitelisted users
    - blacklist - contains links to all blacklisted users
    - approved - contains links to all approved content
      - posts - contains files named with the date of submission
      - comments
        - (parent-hash) - contains files named with date of submission
- posts
  - _board name(s)_
    - _post(s)_ - named with their creation date
- comments
  - _board name(s)_
    - _comment(s)_ - named with their parent object uri
- votes
  - _board name(s)_
    - _vote(s)_ - named with their parent object uri
- profile.json - user's profile data, like name, email, etc
- ipfs-boards-version.txt - used to store compatibility information

In the future, the Data Storage will be changed to comply with IPLD and [POST](https://github.com/ipfs/POST)

#### Board settings

    {
      "whitelist": true,
      "blacklist": false,
      "approval_required": false,
      "whitelist_only": true,
      "fullname": "The Full Name Can Be Long With Spaces",
      "description": "A very Long Full Description with Spaces"
    }

The blacklist and whitelist should contain just IDs separated by spaces.
The admin is _always_ considered as if he is in the whitelist.

if content approval is required:

- content is allowed if it's approved even if the author isn't whitelisted or he is blacklisted
- content is allowed even if not approved if the author is in the whitelist
- content from the whitelisted users is allowed, doesn't need approval

If only whitelisted users are allowed to post:

- only show content from whitelisted users
- approval required option and blacklist are not considered

If the whitelist is disabled, whitelist only is disabled and approval required is disabled:

- eveything from everyone except blacklisted users is allowed
- if the blacklist is disabled, everything is allowed

__TODO__ implement the ability to manually hide content and to name moderators that can approve and hide content

#### Profile.json

    {
      "name": "username",
      "description": "something about me"
    }

#### Post

    {
      "title": "Title of the post",
      "date": "date of the post",
      "board": "optional_board_id",
      "preference": "optional_id_of_the_preferred_administration",
      "text": "Content of the post",
      "previous": "id_of_optional_previous_version",
      "crossposting": "id_of_original_post"
    }

#### Comment

    {
      "parent": "id_of_the_parent_object",
      "date": "date of the comment"
      "preference": "optional_id_of_the_preferred_administration",
      "text": "Content of the post",
      "previous": "id_of_optional_previous_version",
      "crossposting": "id_of_original_comment"
    }

__About Crossposting:__ when crossposting, a post or comment should omit title, text and even
other attributes so that they will be fetched from the original post.

__About Previous Versions:__ when a post or comment is edited, the user should
remove the previous version from the lists in his published profile, but link it
in the appropriate field so that comments to previous versions don't get lost.

#### Vote

    ipfs:boards:vote-for:object_url

#### Versioning

    ipfs:boards:version:version_name

## Boards

Each user can create a board with any name. A board is identified with its name,
or in a more generic context, like this: `#board-name`

That user's version of the board is identified like this: `@user/board-name`

This means that `user` created an __administration__ for the board
__board-name__ and thus by visiting `@user/board-name`
you will view the board according to the rules and administration of `user`.

All the __administration__'s data is stored in `@user`'s profile.

When you post something, by default it goes to all the administrations,
but you can also choose a _preferred administration_ to show your
support or decide in any way which administrations will receive it.
This way administrations can be ranked and communities can form.

If you don't like the administration of your board, you can just use a new one
for browsing, prefer a new one in your posts or create your own administration.

__Administrations can be a lot more than filters:__

An administration can personalize almost everything in how content is viewed,
what content is allowed (acting a filter), whitelists, blacklists, eventually
even the CSS or Layout of the front page, post tags and a lot more.

`admin` is the administrator of the repo. He decides the rules.

You (the user) will be able to choose a main _administration_ for a board and
then also include content from other administrations.

An administration can also instruct clients to include posts approved by other
administrations, distributing administrative work and/or
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

## Optional Cache Servers

They monitor _administrations_ and cache all the content (or some of it)
as soon as it becomes available on the network, making sure it never gets lost.
They are completely optional but they help out, making the system faster and
more stable and consistent.

Cache servers can also act as gateways and provide an HTTP
or WebSocket API to access the boards when IPFS is not available.

Also note that due to how IPFS works, the more popular some content gets,
the _faster it downloads_ and the _easier it is for your computer to find it_.
Censorship is impractical in such a system and data is almost impossible to
take down. That's why IPFS is also called _the permanent web_.
