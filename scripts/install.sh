#!/usr/bin/env bash

set -e

# INSTALL GOOGLE CLOUD SDK
if [ ! -d ~/google-cloud-sdk/lib ]; then
  rm -r ~/google-cloud-sdk
  curl https://sdk.cloud.google.com > ~/gcloud.sh
  chmod +x ~/gcloud.sh
  ~/gcloud.sh --install-dir=${HOME} --disable-prompts > /dev/null
  ~/google-cloud-sdk/bin/gcloud components install kubectl --quiet;
fi


echo $GCLOUD_KEY | base64 -d > ~/.secret.json

gcloud auth activate-service-account --key-file ~/.secret.json
gcloud container clusters get-credentials the-moneymaker --zone europe-north1-a --project ureka-sebastian-tries

# INSTALL HELM
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash
helm init -c
helm init --upgrade
# INSTALL NPM
npm config set registry http://registry.npmjs.org/ # Remove when NPM gets their shit together
npm i -g npm@latest && break
npm ci
