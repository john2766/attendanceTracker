#!/bin/bash
echo "helloworld"
cd ./backend
start gitBash {npm start Read-Host}
cd ..
cd ./frontend
npm start
cd ..