#!/bin/bash

# Number of lines to generate
COUNT=10000

# Output file
OUTPUT="big.ts"

# Clear or create the file
> "$OUTPUT"

# Generate exports
for ((i=0; i<COUNT; i++)); do
  echo "export const x$i = $i;" >> "$OUTPUT"
done

echo "Generated $COUNT lines in $OUTPUT"
