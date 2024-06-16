{ stdenv, lib, makeBinaryWrapper, bun, ... }:

let
  pname = "block-busters-discord-bot";
  pin = lib.importJSON ./pin.json;
  src = ./..;
  packageJson = lib.importJSON "${src}/package.json";
  version = packageJson.version;
  node_modules = stdenv.mkDerivation {
    inherit src version;
    pname = "${pname}-node_modules";
    impureEnvVars = lib.fetchers.proxyImpureEnvVars
      ++ [ "GIT_PROXY_COMMAND" "SOCKS_SERVER" ];
    nativeBuildInputs = [ bun ];
    dontConfigure = true;
    buildPhase = ''
      bun install --no-progress --frozen-lockfile
    '';
    installPhase = ''
      mkdir -p $out/node_modules

      # Do not copy .cache or .bin
      cp -R ./node_modules/* $out/node_modules
      ls -la $out/node_modules
    '';
    dontFixup = true;
    dontPatchShebangs = true;
    outputHash = pin."${stdenv.system}";
    outputHashAlgo = "sha256";
    outputHashMode = "recursive";
  };
in
stdenv.mkDerivation {
  inherit pname src version;
  buildInputs = [ bun ];

  dontConfigure = true;
  # dontBuild = true;

  buildPhase = ''
    runHook preBuild

    ln -s ${node_modules}/node_modules ./node_modules
    bun build --compile --minify src/app.ts

    runHook postBuild
  '';

  dontFixup = true;

  installPhase = ''
    runHook preInstall

    mkdir -p $out/bin

    cp ./app $out/bin/${pname}

    runHook postInstall
  '';
}
