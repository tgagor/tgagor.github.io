#!/bin/bash

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Find all .pre-commit-config.yaml files and get unique directories
echo -e "${BLUE}Searching for .pre-commit-config.yaml files...${NC}"
directories=$(find . -name ".pre-commit-config.yaml" -type f -exec dirname {} \; | sort -u)

if [ -z "$directories" ]; then
    echo -e "${RED}No .pre-commit-config.yaml files found${NC}"
    exit 1
fi

# Count directories
count=$(echo "$directories" | wc -l)
echo -e "${BLUE}Found $count director(ies) with .pre-commit-config.yaml${NC}"
echo ""

# Track results
success_count=0
failure_count=0
failed_dirs=()

# Iterate over each directory
while IFS= read -r dir; do
    echo -e "${BLUE}Processing: $dir${NC}"

    if (cd "$dir" && prek install -f); then
        echo -e "${GREEN}✓ Successfully installed prek in $dir${NC}"
        ((success_count++))
    else
        echo -e "${RED}✗ Failed to install prek in $dir${NC}"
        failed_dirs+=("$dir")
        ((failure_count++))
    fi
    echo ""
done <<< "$directories"

# Summary
echo -e "${BLUE}========== Summary ==========${NC}"
echo -e "${GREEN}Successful: $success_count${NC}"
echo -e "${RED}Failed: $failure_count${NC}"

if [ $failure_count -gt 0 ]; then
    echo -e "\n${RED}Failed directories:${NC}"
    for dir in "${failed_dirs[@]}"; do
        echo "  - $dir"
    done
    exit 1
fi

echo -e "\n${GREEN}All installations completed successfully!${NC}"
exit 0
