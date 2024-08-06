let
  unstableTarball =
    fetchTarball
      https://nixos.org/channels/nixos-unstable/nixexprs.tar.xz;
  pkgs = import <nixpkgs> {}; 
  unstable = import unstableTarball {};

  shell = pkgs.mkShell {
    buildInputs = [ unstable.deno ];
  };  
in shell
