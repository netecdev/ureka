#!/usr/bin/env bash

if [ ! -d ~/google-cloud-sdk/lib ]; then
  rm -r ~/google-cloud-sdk
  curl https://sdk.cloud.google. > ~/gcloud.sh
  chmod +x ~/gcloud.sh
  ~/gcloud.sh --install-dir=${HOME} --disable-prompts > /dev/null
  ~/google-cloud-sdk/bin/gcloud components install kubectl --quiet;
fi


echo $GCLOUD_KEY | base64 > ~/.secret.json
gcloud auth activate-service-account --key-file ~/.secret.json
