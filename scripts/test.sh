#!/bin/sh
echo "Test script is running"
node dist/server/server.js &
sleep 10
npm run test
kill $!