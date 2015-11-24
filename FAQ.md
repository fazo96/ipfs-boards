### How does it work?

See `PROTOCOL.md`

### How do you handle Control and Administration?

See `PROTOCOL.md`

### But isn't gathering all the data slow? And what if a user goes offline?

That's why there are __Cache Servers__. See `PROTOCOL.md`

### What about search engines? They can't index stuff that's not served over plain HTTP

No problem! Cache servers will eventually be able to render pages on the backend
so that content is readable even via HTTP, without Javascript or IPFS access.

### Can I be anonymous?

What if someone monitors my IPFS node? Will they know what content I'm seeing
and everything I post and link it to my IP?

__Yes, but there is a solution.__

You can access a Cache Server's HTTP(s) gateway via Tor for read only access to content.

To post while mantaining anonimity, you would need to run IPFS via Tor.
This is probably not easily done at the moment but it is planned.

There are also security concerns for example getting profiled by your cache's
contents, but there are solutions (in this case, caching everything or a lot of
stuff you don't really care about just to make the data useless).
