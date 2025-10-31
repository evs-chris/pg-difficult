{ stdenv, lib, unzip, deno, makeWrapper, fetchurl }:

stdenv.mkDerivation rec {
  pname = "pg-difficult";
  version = "1.15.0";
  meta = with lib; {
    homepage = "https://github.com/evs-chris/pg-difficult";
    changelog = "https://github.com/evs-chris/pg-difficult/releases/tag/v${version}";
    description = "A tool to record changes to a PostgreSQL database";
    platforms = deno.meta.platforms;
    license = licenses.mit;
    maintainers = with maintainers; [ evs-chris ];
  };

  src = fetchurl {
    url = "https://github.com/evs-chris/pg-difficult/releases/download/v${version}/pg-difficult_deno.zip";
    sha256 = "sha256-X38MKtHCsqcOoemUgR5tTvuTLDpE0Z8NQb1D/EMWhNI=";
  };

  nativeBuildInputs = [ unzip makeWrapper ];
  buildInputs = [ deno ];

  installPhase = ''
    rm deno.jsonc deno.lock
    mkdir -p $out/bin
    cp -r ./* $out/bin
    wrapProgram $out/bin/pg-difficult --prefix PATH : '${lib.makeBinPath buildInputs}'
  '';
}
