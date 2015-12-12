#!/bin/sh
ipfs name publish $(ipfs add -r -q -w $1 | tail -n1)
