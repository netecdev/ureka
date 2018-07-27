#!/usr/bin/env bash

apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubectl
cd ~/
wget https://dl.google.com/dl/cloudsdk/channels/rapid/google-cloud-sdk.tar.gz
tar zxvf google-cloud-sdk.tar.gz
./google-cloud-sdk/install.sh

echo $GCLOUD_KEY | base64 > ~/.secret.json
gcloud auth activate-service-account --key-file ~/.secret.json
