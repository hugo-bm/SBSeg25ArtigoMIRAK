#!/bin/bash

# name of package and version
PACKAGE_NAME="mirak-app"
VERSION="1.0.0"

# Input and output directory 
OUTPUT_DIR="dist"
BUILD_DIR="packaging"

# Clean up previous directories
rm -rf "$OUTPUT_DIR" "$BUILD_DIR"
mkdir -p "$OUTPUT_DIR" "$BUILD_DIR"

# Directory structure for the package
DEBIAN_DIR="$BUILD_DIR/$PACKAGE_NAME/DEBIAN"
OPT_DIR="$BUILD_DIR/$PACKAGE_NAME/opt/$PACKAGE_NAME"
BIN_DIR="$BUILD_DIR/$PACKAGE_NAME/usr/local/bin"

mkdir -p "$DEBIAN_DIR" "$OPT_DIR" "$BIN_DIR"

# Copy the project files
if ! cp -r build/* "$OPT_DIR"; then
  echo "Try to build project with 'npm run build' "
  exit 1
fi

if ! cp -r package.json "$OPT_DIR"; then
  echo "No such file found"
  exit 1
fi

if ! cp -r mirak-app "$OPT_DIR"; then
  echo "No such file found"
  exit 1
fi
chmod +x mirak-app


# Create symbolic link to binary
ln -s "/opt/$PACKAGE_NAME/$PACKAGE_NAME" "$BIN_DIR/$PACKAGE_NAME"

# Control file for .deb
cat > "$DEBIAN_DIR/control" <<EOL
Package: $PACKAGE_NAME
Version: $VERSION
Section: utils
Priority: optional
Architecture: all
Maintainer: Hugo Batalha Moreno <hugomb123@gmail.com>
Description: This component aims to assess the existence of vulnerabilities in the execution environment based on information contained in the MIRAK file.
Depends: nodejs, npm
EOL

# Post-installation script
cat > "$DEBIAN_DIR/postinst" <<EOL
#!/bin/bash

# Install dependencies
cd /opt/$PACKAGE_NAME
if ! npm install --omit=dev; then
  echo "Error installing dependencies. Aborting."
  exit 1
fi
chmod +x mirak-app
cd /usr/local/bin/
chmod +x mirak-app
EOL
chmod +x "$DEBIAN_DIR/postinst"

# Pre-removal script

cat > "$DEBIAN_DIR/prerm" <<EOL
#!/bin/bash

echo "Removing the $PACKAGE_NAME package..."

if [ -L "/usr/local/bin/$PACKAGE_NAME" ]; then
  echo "Removing symbolic link /usr/local/bin/$PACKAGE_NAME..."
  rm -f /usr/local/bin/$PACKAGE_NAME
fi


if [ -d "/opt/$PACKAGE_NAME" ]; then
  echo "Cleaning up dependencies in /opt/$PACKAGE_NAME/..."
  rm -rf /opt/$PACKAGE_NAME/node_modules
  rm -rf /opt/$PACKAGE_NAME/package-lock.json
fi

echo "Package removed successfully."
exit 0
EOL
chmod +x "$DEBIAN_DIR/prerm"

# Creating the .deb package
dpkg-deb --build "$BUILD_DIR/$PACKAGE_NAME" "$OUTPUT_DIR/$PACKAGE_NAME.deb"

# Creating the .rpm package (using fpm)
if command -v fpm &> /dev/null; then
  fpm -s dir -t rpm \
      -n "$PACKAGE_NAME" \
      -v "$VERSION" \
      --after-install "$DEBIAN_DIR/postinst" \
      --description "This component aims to assess the existence of vulnerabilities in the execution environment based on information contained in the MIRAK file" \
      --depends "nodejs" \
      --depends "npm" \
      -C "$BUILD_DIR/$PACKAGE_NAME" . \
      -p "$OUTPUT_DIR/$PACKAGE_NAME.rpm"
else
  echo "FPM not found. Install with 'gem install fpm' to generate .rpm packages."
fi

# Closing message
echo "Packages generated in: $OUTPUT_DIR"
