#!/bin/bash

set -euo pipefail # Exit on errors and undefined variables.

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

IMAGE_DIR="$DIR/../docs/images"

for FILE in "$IMAGE_DIR"/*; do
  echo "$FILE"
  # e.g. convert 000_baby_spider.png -crop 32x32+0+0 000_baby_spider.png
  convert "$FILE" -crop "32x32+0+0" "$FILE"
done