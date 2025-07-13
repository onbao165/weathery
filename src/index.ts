#!/usr/bin/env node

import { Command } from "commander";
import { ConfigManager } from "./weather/config";
import { fetchWeather } from "./weather/fetch";
import { displayWeather } from "./weather/display";
import { CommandLineOptions, PROVIDERS } from "./weather/types";

function parseBoolean(value: string | boolean | undefined): boolean | undefined {
  if (value === undefined || value === "") return true;
  if (typeof value === "boolean") return value;

  const normalized = value.toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;

  console.warn(`Warning: Invalid boolean value "${value}". Using default.`);
  return undefined;
}

async function main() {
  // Parse command line options
  const program = new Command();
  program
    .name("weathery")
    .description("Minimal, customizable and neofetch-like weather CLI written in TypeScript")
    .version("0.1.0")
    .option("-c, --city <city>", "City name")
    .option("-u, --units <units>", "Units (metric/imperial)", "metric")
    .option("--show-city-name [boolean]", "Show city name in output (true/false)", parseBoolean)
    .option("--use-colors [boolean]", "Use colors in output (true/false)", parseBoolean)
    .option("--compact [boolean]", "Display in compact mode (true/false)", parseBoolean)
    .option("--show-config", "Display config file location and exit")
    .addHelpText(
      "after",
      `
Examples:
  $ weathery --city "London"
  $ weathery --city "New York" --units imperial
  $ weathery --city "Tokyo" --use-colors --compact
  $ weathery --use-colors false --compact false  # Turn off previously enabled options

Configuration:
  Config file is stored at: ${new ConfigManager().getConfigFilePath()}

Providers:
  - OpenMeteo (default, no API key required)
  - OpenWeatherMap (requires API key in config file)
`,
    )
    .parse(process.argv);

  const options = program.opts() as CommandLineOptions;

  // Show config file location if requested
  if (options.showConfig) {
    const configManager = new ConfigManager();
    console.log("Config file location:", configManager.getConfigFilePath());
    process.exit(0);
  }

  // Initialize config manager and apply command line options
  const configManager = new ConfigManager();
  const config = configManager.applyCommandLineOptions(options);

  // Check if city is set
  if (!config.city) {
    console.error("Error: City must be set in the config file or via command line flags");
    console.error("Config file location:", configManager.getConfigFilePath());
    console.error(`Run 'weathery --help' for usage information.`);
    process.exit(1);
  }

  // Check if API key is set when using OpenWeatherMap
  if (config.provider === PROVIDERS.OPEN_WEATHER_MAP && !config.apiKey) {
    console.error("Error: API key must be set in the config file when using OpenWeatherMap");
    console.error("Get your API key from https://openweathermap.org/api");
    console.error("Config file location:", configManager.getConfigFilePath());
    console.error(`Run 'weathery --help' for usage information.`);
    process.exit(1);
  }

  try {
    // Fetch weather data
    const weatherData = await fetchWeather(config);

    // Display the weather
    displayWeather(weatherData, config);
  } catch (error) {
    console.error(`Failed to fetch weather data: ${error instanceof Error ? error.message : error}`);
    console.error("Please check your internet connection and API key.");
    process.exit(1);
  }
}

// Execute the main function
main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
