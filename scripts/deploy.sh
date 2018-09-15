#!/usr/bin/env bash

set -e

export VERSION="$TRAVIS_COMMIT"
export BRANCH="$TRAVIS_BRANCH"
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

lerna run deploy
