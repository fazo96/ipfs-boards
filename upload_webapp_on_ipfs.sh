#!/bin/sh
echo "/ipfs/$(ipfs add -r -q webapp/dist | tail -n1)"
