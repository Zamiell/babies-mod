#!/bin/bash

set -euo pipefail # Exit on errors and undefined variables.

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

IMAGE_DIR="$DIR/../docs/images"

# The vanilla baby spritesheets contain all of the frames (e.g. facing up, down, left, right, and
# shooting). In the documentation for this mod, we only want to display the first frame (e.g. facing
# down). We can crop the images using CSS styles, but GitHub markdown removes all CSS other than
# width and height. Thus, we must crop the images after copy-pasting them from the game files.
# Additionally, we scale them up from 32x32 to 64x64, because they are hard to see otherwise. (We
# do not use the "width" and "height" HTML attributes to scale them because it causes them to become
# blurry.)
for FILE in "$IMAGE_DIR"/*; do
  echo "$FILE"
  convert "$FILE" -crop "32x32+0+0" -scale "200%" "$FILE"
done
