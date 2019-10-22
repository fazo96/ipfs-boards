# IPFS Boards

Boards is an experiment with the goal of figuring out whether it's possible to have
a discussion board, forum or social network that works inside a normal browser tab
without relying on servers, desktop applications, browser extensions, the blockchain
or anything else.

The goals in detail:

- all communication should happen in the most distributed way possible using
peer to peer systems
- should work completely offline without anything else other than a web browser
after it's downloaded for the first time 
- all data including assets, code and user created content needs to be distributed
and/or replicated between the users

The project is in prototype stage and works thanks to the [IPFS](https://ipfs.io)
distributed file system.

The first iteration focuses on creating boards, posting content and commenting.
Moderation tools, encryption, friends lists, private messages, real time chat and
other features will be attempted in the future

### Under the hood

This project is a web UI, [orbit-db-discussion-board](https://github.com/fazo96/orbit-db-discussion-board)
is the underlying library

## Try it out

Years old build hosted on IPFS, probably broken by now:

https://ipfs.io/ipfs/QmYT9EzvQY8zwtxQxUhPcphSGR4XtTRkT4MnXmQKPFamQ7

This allows you to create boards and posts. There is no moderation
or commenting yet and a lot of things are super wonky

## Working on the code

This is a next.js project, a React framework.

Clone this repo, then run

- `npm install` to install dependencies
- `npm run dev` to start a development server
- `npm run build` to create a production build then `npm start` to start the frontend server

## Old Version

You're looking at the new implementation of Boards. If you want to check out the
old one [follow this link](https://github.com/fazo96/ipfs-boards/tree/legacy)
