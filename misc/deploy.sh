#!/bin/bash
set -e

# make sure output files exists
ls demo

# move files into place
rm -rf tmp
mkdir -p tmp/public_html
cp -r demo/* tmp/public_html

# create cloud code repo
cd tmp
touch __init__.py
git init
git add .
git commit -m '.'

# push to skygear server
git remote add skygear ssh://git@git.skygeario.com/reactchatdemo.git
git push --force --set-upstream skygear master

# clean up
cd ..
rm -rf tmp
