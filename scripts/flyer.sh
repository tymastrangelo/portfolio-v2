#!/usr/bin/env bash
# Turn an event flyer into a web-sized jpg for /floor.
#   ./scripts/flyer.sh ~/Downloads/movie-night.pdf movie-night
# Takes pdf, jpg, png, heic. Multi page pdfs use page 1, which is all a flyer is.
set -euo pipefail

src=${1:?usage: scripts/flyer.sh <flyer.pdf|jpg|png|heic> <slug>}
slug=${2:?usage: scripts/flyer.sh <flyer.pdf|jpg|png|heic> <slug>}
root=$(cd "$(dirname "$0")/.." && pwd)
out="$root/public/floor/$slug.jpg"

mkdir -p "$root/public/floor"
sips -s format jpeg -s formatOptions 80 -Z 1400 "$src" --out "$out" >/dev/null
w=$(sips -g pixelWidth "$out" | awk '/pixelWidth/{print $2}')
h=$(sips -g pixelHeight "$out" | awk '/pixelHeight/{print $2}')

echo "wrote public/floor/$slug.jpg (${w}x${h}, $(du -h "$out" | cut -f1))"
echo
echo "add to the events array in lib/floor.ts:"
cat <<SNIP

  {
    title: 'Event name',
    start: '$(date +%Y-%m-%d)T20:00',
    where: 'Chandler 1 lounge',
    blurb: 'One or two sentences.',
    flyer: '/floor/$slug.jpg',
    ar: '$w/$h',
  },
SNIP
