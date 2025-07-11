#!/bin/bash
npm install pm2 -g &&
cd backend &&
pm2 start start-backend.sh &&
cd ../frontend &&
pm2 start start-frontend.sh
