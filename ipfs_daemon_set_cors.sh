#!/bin/bash

# This will make sure your ipfs node works with the app.
# NOTE: this change is PERMANENT until reversed!

# If you want a temporary solution, try running your daemon like this:
# API_ORIGIN="localhost:8080" ipfs daemon
# replace localhost:8080 with whatever domain:port you're connecting from :)
# Also see https://github.com/ipfs/js-ipfs-api#cors

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
