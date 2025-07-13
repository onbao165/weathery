import * as os from "os";
import * as path from "path";
import * as fs from "fs/promises";
import Conf from "conf";
import { Config, CommandLineOptions, PROVIDERS } from "./types";

export function getDefaultConfig(): Config {
  return {
    provider: PROVIDERS.OPEN_METEO,
    apiKey: "",
    city: "",
    units: "metric",
    showCityName: true,
    useColors: false,
    compact: false,
  };
}

// This is not needed as Conf handles the path internally
// export function getConfigPath(): string {
//   const homedir = os.homedir();
//   if (process.platform === "win32") {
//     // Windows: %APPDATA%\weathery\config.json
//     return path.join(
//       process.env.APPDATA || path.join(homedir, "AppData", "Roaming"),
//       "weathery",
//       "config.json"
//     );
//   } else {
//     // Linux/macOS: ~/.config/weathery/config.json
//     return path.join(homedir, ".config", "weathery", "config.json");
//   }
// }

export function validateConfig(config: Config): Config {
  const validatedConfig = { ...config };

  // Validate provider
  if (!Object.values(PROVIDERS).includes(config.provider)) {
    console.warn(
      `Invalid provider: ${config.provider}. Using default: ${PROVIDERS.OPEN_METEO}`
    );
    // Use OpenMeteo as default
    validatedConfig.provider = PROVIDERS.OPEN_METEO;
  }

  // Validate units
  if (config.units !== "metric" && config.units !== "imperial") {
    console.warn(`Invalid units: ${config.units}. Using default: metric`);
    // Use metric as default
    validatedConfig.units = "metric";
  }

  // Validate API key requirement
  if (
    validatedConfig.provider === PROVIDERS.OPEN_WEATHER_MAP &&
    !validatedConfig.apiKey
  ) {
    console.warn("Warning: 'apiKey' is required for OpenWeatherMap provider.");
    console.warn("Falling back to OpenMeteo as default provider.");
    validatedConfig.provider = PROVIDERS.OPEN_METEO;
  }
  return validatedConfig;
}

export class ConfigManager {
  private conf: Conf<Config>;
  constructor() {
    // Create a Conf instance with our schema and custom path
    this.conf = new Conf<Config>({
      projectName: "weathery",
      projectSuffix: "",
      schema: {
        provider: {
          type: "string",
          default: PROVIDERS.OPEN_METEO,
        },
        apiKey: {
          type: "string",
          default: "",
        },
        city: {
          type: "string",
          default: "",
        },
        units: {
          type: "string",
          default: "metric",
          enum: ["metric", "imperial"],
        },
        showCityName: {
          type: "boolean",
          default: true,
        },
        useColors: {
          type: "boolean",
          default: false,
        },
        compact: {
          type: "boolean",
          default: false,
        },
      },
      defaults: getDefaultConfig(),
    });

    const config = this.getConfig();
    const validatedConfig = validateConfig(config);
    this.setConfig(validatedConfig);
  }
  getConfig(): Config {
    return this.conf.store as Config;
  }

  setConfig(config: Config): void {
    this.conf.store = config;
  }

  applyCommandLineOptions(options: CommandLineOptions): Config {
    const config = this.getConfig();
    // Only override values that are explicitly provided
    if (options.city !== undefined) {
      config.city = options.city;
    }
    if (options.units !== undefined) {
      config.units = options.units;
    }
    if (options.showCityName !== undefined) {
      config.showCityName = options.showCityName;
    }
    if (options.useColors !== undefined) {
      config.useColors = options.useColors;
    }
    if (options.compact !== undefined) {
      config.compact = options.compact;
    }

    const validatedConfig = validateConfig(config);
    this.setConfig(validatedConfig);
    return validatedConfig;
  }

  getConfigFilePath(): string {
    return this.conf.path;
  }
}

/**
 * Create a new ConfigManager instance
 */
export function createConfigManager(): ConfigManager {
  return new ConfigManager();
}
