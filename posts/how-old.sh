#!/bin/bash

CURRENT_TIMESTAMP=$(date +%s)


echo "Image | Creation date | Age (in days) | Packages to upgrade"
echo "---|---|---|---"

for i in centos:7 centos:8 \
    debian:9 debian:10 \
    ubuntu:18.04 ubuntu:20.04 \
    alpine:3.11 alpine:3.12 alpine:3.13 \
    node:10 node:12 node:14 node:15 \
    openjdk:8 openjdk:11 openjdk:15 ;
do
    docker pull $i >/dev/null;
    OUTPUT=$(docker inspect $i -f '{{ index .RepoTags 0 }} {{ .Created }}')
    FORMAT_TIME=$(echo $OUTPUT | cut -f2 -d ' ' | xargs -I{} date +%s -d {} )

    for r in "$OUTPUT"; do
        IMAGE_NAME=$(echo $r | cut -f1 -d ' ')
        CREATION_DATE=$(echo $r | cut -f2 -d ' ')
        CREATION_TIMESTAMP=$(date +%s -d $CREATION_DATE)
        TIME_DIFF=$(( "$CURRENT_TIMESTAMP" - "$CREATION_TIMESTAMP" ))
        TIME_DIFF_DAYS=$(( "$TIME_DIFF" / 86400))
        PACKAGES_TO_UPGRADE=$(docker run -ti --rm $i sh -c 'if command -v yum >/dev/null; then yum list updates -q | grep -v Updated | wc -l; elif command -v apt >/dev/null; then apt-get update -qq && apt list --upgradable 2>/dev/null | grep -vP "^List" | wc -l ; elif command -v apk >/dev/null; then apk --no-cache upgrade -s 2>/dev/null | grep -E "^\(" | wc -l; fi')

        echo "$IMAGE_NAME | $CREATION_DATE | $TIME_DIFF_DAYS | $PACKAGES_TO_UPGRADE"
    done
done
