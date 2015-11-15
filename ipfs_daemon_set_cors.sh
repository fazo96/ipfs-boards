#!/bin/bash

# This will make sure your ipfs node works with the app.
# Note that it's not safe to do if your node is accessible from the internet or your LAN. Be careful!

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
