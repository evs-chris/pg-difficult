deno run -A build-client.ts
if [ ! -d build ]; then
  mkdir build
fi
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-unknown-linux-gnu -o build/pg-difficult_linux-x64 ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-pc-windows-msvc -o build/pg-difficult_windows-x64 ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target x86_64-apple-darwin -o build/pg-difficult_macos-x64 ./serve.ts
deno compile -A --unsafely-ignore-certificate-errors --target aarch64-apple-darwin -o build/pg-difficult_macos-arm64 ./serve.ts

./package-client.sh
cp -r build/client/* docs/
