#!/bin/bash

# Number of top-level folders
FOLDERS=20

# Number of subfolders per folder
SUBFOLDERS=10

# Number of files per subfolder
FILES=5

# Output root directory
ROOT="bigProject"

# Clear old and recreate
rm -rf "$ROOT"
mkdir "$ROOT"

echo "Generating project tree..."

# Loop through top-level folders
for ((f=1; f<=FOLDERS; f++)); do
  FOLDER="$ROOT/module$f"
  mkdir -p "$FOLDER"

  # Create subfolders
  for ((s=1; s<=SUBFOLDERS; s++)); do
    SUB="$FOLDER/sub$s"
    mkdir -p "$SUB"

    # Create multiple TS files inside each subfolder
    for ((i=1; i<=FILES; i++)); do
      FILE="$SUB/file$i.ts"

      # Import from other modules to stress dependency graph
      IMPORT1="../../module$(( (f % FOLDERS) + 1 ))/sub$(( (s % SUBFOLDERS) + 1 ))/file$(( (i % FILES) + 1 ))"
      IMPORT2="../sub$(( (s % SUBFOLDERS) + 1 ))/file$(( (i % FILES) + 1 ))"

      cat > "$FILE" <<EOF
import { valueA } from "$IMPORT1";
import { valueB } from "$IMPORT2";

export const file${f}_${s}_${i} = {
  data: valueA + valueB,
  path: "$FILE",
};

EOF

    done
  done
done

echo "Done! Generated $FOLDERS folders × $SUBFOLDERS subfolders × $FILES files each."
echo "Project root: $ROOT/"
