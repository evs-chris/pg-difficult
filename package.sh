#! /usr/bin/env nix-shell
#! nix-shell -i bash -p deno tinyxxd coreutils gnused zip

if [ `deno -v | cut -d ' ' -f 2 | cut -d . -f 1` -lt 2 ]; then
  echo "Deno 2 or later is required."
  exit 1
fi

VERSION=`cat serve.ts | grep 'const VERSION =' | sed -re "s/[^0-9.]//g"`
echo "Building pg-difficult version ${VERSION}..."

rm -r ./build/*
if [ ! -d ./build ]; then
  mkdir ./build
fi

# package base app
mkdir ./build/app
cp -r serve.ts diff.ts public deno.jsonc deno.lock ./build/app
cat <<END > ./build/app/pg-difficult
#!/usr/bin/env bash
cd "\${0%/*}"
deno run -A --unsafely-ignore-certificate-errors ./serve.ts \$@
END
chmod +x build/app/pg-difficult
cd build
zip -r pg-difficult_deno.zip app
cd ../

CHECKSUM=`sha256sum -b ./build/pg-difficult_deno.zip | cut -d ' ' -f 1 | xxd -r -p | base64`
cat nix.template | sed -e "s/VERSION/${VERSION}/g; s:CHECKSUM:${CHECKSUM}:g" | tee nix/pg-difficult.nix

# try to make it easier for nix?
tar -czf build/nix.tar.gz nix

# compile binaries
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-unknown-linux-gnu -o build/pg-difficult_linux-x64 --include ./public ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-pc-windows-msvc --icon pg-difficult.ico -o build/pg-difficult_windows-x64 --include ./public ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-apple-darwin -o build/pg-difficult_macos-x64 --include ./public ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target aarch64-apple-darwin -o build/pg-difficult_macos-arm64 --include ./public ./serve.ts

# build client-only app
./package-client.sh
cp -r build/client/* docs/
