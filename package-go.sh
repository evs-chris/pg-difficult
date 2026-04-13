#!/usr/bin/env bash
set -e
if [ ! -d build ]; then
  mkdir build
fi

export CGO_ENABLED=0

VERSION=`cat VERSION`
echo Building pg-difficult v${VERSION}

echo Preparing assets...
cp -r public build/public
cat public/index.js | sed -re "s/CLIENT_VERSION = 'DEV'/CLIENT_VERSION = '${VERSION}'/" > build/public/index.js
rm public.zip
cd build
zip -qr ../public.zip public
cd ..
rm -r build/public

echo Building linux amd64...
GOOS=linux GOARCH=amd64 go build -o build/pg-difficult_linux-amd64 .
echo Building linux arm64...
GOOS=linux GOARCH=arm64 go build -o build/pg-difficult_linux-arm64 .
echo Building windows amd64...
GOOS=windows GOARCH=amd64 go build -o build/pg-difficult_windows-amd64.exe .
echo Building windows arm64...
GOOS=windows GOARCH=arm64 go build -o build/pg-difficult_windows-arm64.exe .
echo Building macos amd64...
GOOS=darwin GOARCH=amd64 go build -o build/pg-difficult_macos-amd64 .
echo Building macos arm64...
GOOS=darwin GOARCH=arm64 go build -o build/pg-difficult_macos-arm64 .

echo Building docs...
if [ -d docs ]; then
  rm -r docs
fi
mkdir docs
cp -r public/* docs
cat public/index.html | sed -re 's/<!-- HEAD -->/<script>clientOnly = true<\/script>/' > docs/index.html
cat public/index.js | sed -re "s/CLIENT_VERSION = 'DEV'/CLIENT_VERSION = '${VERSION}'/" > docs/index.js
touch docs/.nojekyll

echo Done!
