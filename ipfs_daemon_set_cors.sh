#!/bin/bash

# This will make sure your ipfs node works with the app.
# NOTE: this change is PERMANENT until reversed!
# See https://github.com/ipfs/js-ipfs-api#cors for a temporary solution instead

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
