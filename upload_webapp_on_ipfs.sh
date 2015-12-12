#!/bin/sh
npm run build && echo "/ipfs/$(ipfs add -r -q webapp/dist | tail -n1)"
