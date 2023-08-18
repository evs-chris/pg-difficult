{ pkgs ? import <nixpkgs> {} }:

let packages = rec {
  pg-difficult = pkgs.callPackage ./pg-difficult.nix {};
}; in packages
