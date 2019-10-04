#!/usr/bin/env bash
REMOTE=`git remote get-url origin`
set -e

yarn build
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f $REMOTE master:gh-pages

cd -