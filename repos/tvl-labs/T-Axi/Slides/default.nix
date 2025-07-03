{ pkgs ? import <nixpkgs> {} }:

with pkgs;

stdenv.mkDerivation {
  name = "T-Axi";
  buildInputs = [ (texlive.combine {
                    inherit (texlive)
                      scheme-small

                      # Add other LaTeX libraries (packages) here as needed, e.g:
                      # xparse

                      # build tools
                      latexmk
                      ;
                  })
                  glibcLocales
                ];
  src = ./.;

  meta = with lib; {
    description = "Prototype of type theoretical Axi - docs and implementation";
    license = licenses.isc;
    platforms = platforms.linux;
  };
}
