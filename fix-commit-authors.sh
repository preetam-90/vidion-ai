#!/bin/bash

# Replace with your actual GitHub email
CORRECT_EMAIL="preetamkumar8873@gmail.com"
CORRECT_NAME="preetam-90"

git filter-branch --env-filter '
    if [ "$GIT_COMMITTER_EMAIL" = "preetam@example.com" ]
    then
        export GIT_COMMITTER_EMAIL="'$CORRECT_EMAIL'"
        export GIT_COMMITTER_NAME="'$CORRECT_NAME'"
    fi
    if [ "$GIT_AUTHOR_EMAIL" = "preetam@example.com" ]
    then
        export GIT_AUTHOR_EMAIL="'$CORRECT_EMAIL'"
        export GIT_AUTHOR_NAME="'$CORRECT_NAME'"
    fi
' --tag-name-filter cat -- --branches --tags 