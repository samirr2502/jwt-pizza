#!/bin/bash

ROOT="bulkProject"
FILES=30

# Reset output folder
rm -rf "$ROOT"
mkdir "$ROOT"

echo "Generating all.ts with $FILES values..."

# Create all.ts
ALL="$ROOT/all.ts"

echo "// File exporting 30 independent values" > "$ALL"

# Write all exports
for ((i=1; i<=FILES; i++)); do
  echo "export const value$i = $i;" >> "$ALL"
done

echo "all.ts created!"

# Generate 30 files that each import a different value from all.ts
echo "Generating $FILES importing files..."

for ((i=1; i<=FILES; i++)); do
  FILE="$ROOT/file$i.ts"

  cat > "$FILE" <<EOF
import { value$i } from "./all";

export const result$i = value$i * 2;
EOF

done

echo "Done! Created all.ts and $FILES importing files in $ROOT/"
