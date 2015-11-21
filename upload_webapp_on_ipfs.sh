#!/bin/sh
gulp && echo "/ipfs/$(ipfs add -r -q webapp/dist | tail -n1)"
