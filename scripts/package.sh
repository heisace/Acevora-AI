#!/bin/bash

# StudyGen AI - Source Code Packaging Script
# This script creates a downloadable archive of the entire project

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  StudyGen AI - Source Code Packaging${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Get version from package.json
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
ARCHIVE_NAME="studygen-ai-v${VERSION}.zip"
BUILD_DIR="dist"

echo -e "${YELLOW}Creating source code archive...${NC}"

# Create dist directory if it doesn't exist
mkdir -p "${BUILD_DIR}"

# List of files and directories to include
INCLUDE=(
  "app/"
  "components/"
  "lib/"
  "public/"
  "__tests__/"
  "scripts/"
  "package.json"
  "package-lock.json"
  "tsconfig.json"
  "next.config.mjs"
  "tailwind.config.ts"
  "postcss.config.mjs"
  "vitest.config.ts"
  ".env.example"
  ".gitignore"
  "README.md"
  "DEPLOYMENT.md"
  "ARCHITECTURE.md"
)

# Files to exclude
EXCLUDE=(
  ".next"
  "node_modules"
  ".git"
  ".vercel"
  "dist"
  ".DS_Store"
  "*.log"
)

# Create archive
echo -e "${YELLOW}Archiving project files...${NC}"
zip -r "${BUILD_DIR}/${ARCHIVE_NAME}" \
  -x "node_modules/*" ".next/*" ".git/*" ".vercel/*" "dist/*" "*.log" ".DS_Store" \
  "${INCLUDE[@]}"

# Calculate size
SIZE=$(du -h "${BUILD_DIR}/${ARCHIVE_NAME}" | cut -f1)

echo ""
echo -e "${GREEN}✓ Archive created successfully!${NC}"
echo ""
echo -e "${BLUE}Archive Details:${NC}"
echo "  Name: ${ARCHIVE_NAME}"
echo "  Size: ${SIZE}"
echo "  Location: ${BUILD_DIR}/"
echo ""

# Create checksum
echo -e "${YELLOW}Creating checksum...${NC}"
cd "${BUILD_DIR}"
if command -v sha256sum &> /dev/null; then
  sha256sum "${ARCHIVE_NAME}" > "${ARCHIVE_NAME}.sha256"
  echo -e "${GREEN}✓ Checksum created: ${ARCHIVE_NAME}.sha256${NC}"
fi
cd ..

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}Package ready for distribution!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo "📦 Download: dist/${ARCHIVE_NAME}"
echo "📝 Installation Instructions:"
echo "   1. Extract the archive"
echo "   2. Run: npm install"
echo "   3. Configure .env.local with your keys"
echo "   4. Run: npm run dev"
echo ""
