#!/bin/sh
node dist/server/server.js &
sleep 10
npm run test
kill $!