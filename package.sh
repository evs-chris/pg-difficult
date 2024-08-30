rm -r ./build/*
deno run -A build-client.ts
if [ ! -d ./build ]; then
  mkdir ./build
fi

# package base app
mkdir ./build/app
cp -r serve.ts diff.ts client.ts public deno.jsonc deno.lock ./build/app
cat <<END > ./build/app/pg-difficult
#!/usr/bin/env bash
cd "\${0%/*}"
deno run -A --unsafely-ignore-certificate-errors ./serve.ts \$@
END
chmod +x build/app/pg-difficult
cd build
zip -r pg-difficult_deno.zip app
cd ../

# try to make it easier for nix?
tar -czf build/nix.tar.gz nix

# compile binaries
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-unknown-linux-gnu -o build/pg-difficult_linux-x64 ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-pc-windows-msvc --icon pg-difficult.ico -o build/pg-difficult_windows-x64 ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-apple-darwin -o build/pg-difficult_macos-x64 ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target aarch64-apple-darwin -o build/pg-difficult_macos-arm64 ./serve.ts

# build client-only app
./package-client.sh
cp -r build/client/* docs/
