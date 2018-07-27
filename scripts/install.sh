#!/usr/bin/env bash

apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubectl
if [ ! -d ${HOME}/google-cloud-sdk ]; then
  curl https://sdk.cloud.google.com | bash;
fi

echo $GCLOUD_KEY | base64 > ~/.secret.json
gcloud auth activate-service-account --key-file ~/.secret.json
