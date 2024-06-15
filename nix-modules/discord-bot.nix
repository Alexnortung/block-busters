{ config, lib, ... }:

let
  inherit (lib)
    types
    mkIf
    mkEnableOption
    mkOption;
  serviceName = "block-busters-discord-bot";
  cfg = config.services.${serviceName};
in
{
  options.services.${serviceName} = {
    enable = mkEnableOption "Enabled ${serviceName}";

    package = mkOption {
      type = types.package;
    };

    rconHost = mkOption {
      type = types.str;
      description = ''
        The host that rcon is hosted on
      '';
    };

    rconPort = mkOption {
      type = types.int;
      description = ''
        The port that rcon is hosted on
      '';
    };

    environmentFile = mkOption {
      type = types.path;
      description = ''
        An environment file containing the following keys:
          CLIENT_ID
          DISCORD_TOKEN
          MINECRAFT_RCON_PASSWORD
          GITHUB_TOKEN
      '';
    };

    # discordToken = mkOption {
    #   type = types.str;
    #   description = ''
    #     Discord token for the bot
    #   '';
    # };
    #
    # clientId = mkOption {
    #   type = types.str;
    #   description = ''
    #     The client id of the discord app
    #   '';
    # };
    #
    #
    # githubToken = mkOption {
    #   type = types.str;
    #   description = ''
    #     The github
    #   '';
    # };
  };

  config = mkIf cfg.enable {
    systemd.services.${serviceName} = {
      description = "Discord bot that manages the block busters server";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];

      enable = cfg.enable;

      environment = {
        MINECRAFT_RCON_HOST = cfg.rconHost;
        MINECRAFT_RCON_PORT = "${toString cfg.rconPort}";
      };

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/block-busters-discord-bot";
        EnvironmentFile = cfg.environmentFile;
      };
    };
  };
}
