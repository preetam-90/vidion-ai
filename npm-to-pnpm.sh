#!/bin/bash

# Check if the command is npm
if [[ "$0" == *"npm" ]]; then
  echo -e "\e[31mUsing npm directly is not allowed in this project.\e[0m"
  echo -e "\e[31mPlease use pnpm instead.\e[0m"
  echo -e "\e[36mExample: pnpm $*\e[0m"
  exit 1
fi

# Check if the command is yarn
if [[ "$0" == *"yarn" ]]; then
  echo -e "\e[31mUsing yarn directly is not allowed in this project.\e[0m"
  echo -e "\e[31mPlease use pnpm instead.\e[0m"
  echo -e "\e[36mExample: pnpm $*\e[0m"
  exit 1
fi

# For all other commands, execute them normally
exec "$@" 