if [ ! -d build ]; then
  mkdir build
fi

if [ ! -d build/client ]; then
  mkdir build/client
fi

cp -r public/* build/client
cat public/index.html | sed -re 's/<!-- HEAD -->/<script>clientOnly = true<\/script>/' > build/client/index.html
