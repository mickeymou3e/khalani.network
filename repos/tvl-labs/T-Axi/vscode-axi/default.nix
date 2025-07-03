{ lib, vscode-utils, unzip }:

vscode-utils.buildVscodeExtension
{
  name = "axi-syntax-highlighting";
  version = "0.1.0";
  src = ./axi-syntax-highlighting-0.1.0.vsix;
  sourceRoot = ".";

  # Explicitly unpack the .vsix file:
  unpackPhase = ''
    ${unzip}/bin/unzip $src
    sourceRoot=extension
  '';

  vscodeExtPublisher = "khalani";
  vscodeExtName = "axi-syntax-highlighting";
  vscodeExtUniqueId = "khalani.axi-syntax-highlighting";

  meta = with lib;
  {
    description = "Axi syntax highlighting";
    license = licenses.mit;
    platforms = platforms.all;
  };
}
