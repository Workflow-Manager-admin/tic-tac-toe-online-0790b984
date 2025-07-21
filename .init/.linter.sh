#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-online-0790b984/frontend_reactjs
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

