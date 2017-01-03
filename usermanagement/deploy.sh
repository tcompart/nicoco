#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
else
  echo "Successful build: Deploying master to openshift cartidge"
fi

rev=$(git rev-parse --short HEAD)

cd usermanagement

rm -f .gitignore
mv .openshift_gitignore .gitignore

git init
git config user.name "Travis CI"
git config user.email "travis@localhost.localdomain"
git config --global push.default simple

git remote add upstream "ssh://57b782650c1e66b82000000e@nicoco-nicoco.rhcloud.com/~/git/nicoco.git/"
git fetch upstream
git reset upstream

echo "Fetching and reseting openshift repo"

touch .

git add -A .
git commit -m "Deploying openshift at Revision ${rev}"
git push -qf upstream HEAD
