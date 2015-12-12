#!/bin/bash

# This will make sure your ipfs node works with the app.
# NOTE: this change is PERMANENT until reversed!

### IMPORTANT NOTE ABOUT SECURITY ###
# By setting these, YOU WILL ALLOW ANY STATIC WEBSITE TO FULLY CONTROL YOUR
# IPFS NODE! A solution for this problem, using API Tokens, is planned!

# If you want a temporary way to set CORS, try running your daemon like this:
# API_ORIGIN="localhost:8080" ipfs daemon
# replace localhost:8080 with whatever domain:port you're connecting from :)
# Also see https://github.com/ipfs/js-ipfs-api#cors

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
