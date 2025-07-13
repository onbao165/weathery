import chalk from "chalk";

/**
 * Interface for weather icon definitions
 */
export interface WeatherIcon {
  monochrome: string[];
  colored: string[];
}

/**
 * Map of weather condition names to their ASCII art representations
 */
export const weatherIcons: Record<string, WeatherIcon> = {
  Unknown: {
    monochrome: [
      "             ",
      "    .-.      ",
      "     __)     ",
      "    (        ",
      "     `-'     ",
      "      •      ",
      "             ",
    ],
    colored: [
      "             ",
      "    .-.      ",
      "     __)     ",
      "    (        ",
      "     `-'     ",
      "      •      ",
      "             ",
    ],
  },
  Sunny: {
    monochrome: [
      "             ",
      "    \\   /    ",
      "     .-.     ",
      "  ― (   ) ―  ",
      "     `-'     ",
      "    /   \\    ",
      "             ",
    ],
    colored: [
      "             ",
      chalk.yellow("    \\   /    "),
      chalk.yellow("     .-.     "),
      chalk.yellow("  ― (   ) ―  "),
      chalk.yellow("     `-'     "),
      chalk.yellow("    /   \\    "),
      "             ",
    ],
  },
  PartlyCloudy: {
    monochrome: [
      "             ",
      "   \\  /      ",
      ' _ /\"\".-.    ',
      "   \\_(   ).  ",
      "   /(___(__) ",
      "             ",
      "             ",
    ],
    colored: [
      "             ",
      chalk.yellow("   \\  /      "),
      chalk.yellow(' _ /\"\"') + chalk.gray(".-.    "),
      chalk.yellow("   \\_") + chalk.gray("(   ).  "),
      chalk.yellow("   /") + chalk.gray("(___(__) "),
      "             ",
      "             ",
    ],
  },
  Cloudy: {
    monochrome: [
      "             ",
      "             ",
      "     .--.    ",
      "  .-(    ).  ",
      " (___.__)__) ",
      "             ",
      "             ",
    ],
    colored: [
      "             ",
      "             ",
      chalk.gray("     .--.    "),
      chalk.gray("  .-(    ).  "),
      chalk.gray(" (___.__)__) "),
      "             ",
      "             ",
    ],
  },
  VeryCloudy: {
    monochrome: [
      "             ",
      "             ",
      "     .--.    ",
      "  .-(    ).  ",
      " (___.__)__) ",
      "             ",
      "             ",
    ],
    colored: [
      "             ",
      "             ",
      chalk.gray.bold("     .--.    "),
      chalk.gray.bold("  .-(    ).  "),
      chalk.gray.bold(" (___.__)__) "),
      "             ",
      "             ",
    ],
  },
  LightShowers: {
    monochrome: [
      "             ",
      ' _`/\"\".-.    ',
      "  ,\\_(   ).  ",
      "   /(___(__) ",
      "     ' ' ' ' ",
      "    ' ' ' '  ",
      "             ",
    ],
    colored: [
      "             ",
      chalk.yellow(' _`/\"\"') + chalk.gray(".-.    "),
      chalk.yellow("  ,\\_") + chalk.gray("(   ).  "),
      chalk.yellow("   /") + chalk.gray("(___(__) "),
      chalk.blue("     ' ' ' ' "),
      chalk.blue("    ' ' ' '  "),
      "             ",
    ],
  },
  HeavyShowers: {
    monochrome: [
      "             ",
      ' _`/\"\".-.    ',
      "  ,\\_(   ).  ",
      "   /(___(__) ",
      "   ‚'‚'‚'‚'  ",
      "   ‚'‚'‚'‚'  ",
      "             ",
    ],
    colored: [
      "             ",
      chalk.yellow(' _`/\"\"') + chalk.gray.bold(".-.    "),
      chalk.yellow("  ,\\_") + chalk.gray.bold("(   ).  "),
      chalk.yellow("   /") + chalk.gray.bold("(___(__) "),
      chalk.blue.bold("   ‚'‚'‚'‚'  "),
      chalk.blue.bold("   ‚'‚'‚'‚'  "),
      "             ",
    ],
  },
  LightSnow: {
    monochrome: [
      "             ",
      "     .-.     ",
      "    (   ).   ",
      "   (___(__)  ",
      "    *  *  *  ",
      "   *  *  *   ",
      "             ",
    ],
    colored: [
      "             ",
      chalk.gray("     .-.     "),
      chalk.gray("    (   ).   "),
      chalk.gray("   (___(__)  "),
      chalk.white("    *  *  *  "),
      chalk.white("   *  *  *   "),
      "             ",
    ],
  },
  HeavySnow: {
    monochrome: [
      "             ",
      "     .-.     ",
      "    (   ).   ",
      "   (___(__)  ",
      "   * * * *   ",
      "  * * * *    ",
      "             ",
    ],
    colored: [
      "             ",
      chalk.gray.bold("     .-.     "),
      chalk.gray.bold("    (   ).   "),
      chalk.gray.bold("   (___(__)  "),
      chalk.white.bold("   * * * *   "),
      chalk.white.bold("  * * * *    "),
      "             ",
    ],
  },
  Thunderstorm: {
    monochrome: [
      "             ",
      "     .-.     ",
      "    (   ).   ",
      "   (___(__)  ",
      '    ⚡\"\"⚡\"\" ',
      "  ‚'‚'‚'‚'   ",
      "             ",
    ],
    colored: [
      "             ",
      chalk.gray.bold("     .-.     "),
      chalk.gray.bold("    (   ).   "),
      chalk.gray.bold("   (___(__)  "),
      chalk.yellow.bold("    ⚡") + chalk.blue('\"\"') + chalk.yellow.bold("⚡") + chalk.blue('\"\" '),
      chalk.blue.bold("  ‚'‚'‚'‚'   "),
      "             ",
    ],
  },
  Fog: {
    monochrome: [
      "             ",
      "             ",
      " _ - _ - _ - ",
      "  _ - _ - _  ",
      " _ - _ - _ - ",
      "             ",
      "             ",
    ],
    colored: [
      "             ",
      "             ",
      chalk.white(" _ - _ - _ - "),
      chalk.white("  _ - _ - _  "),
      chalk.white(" _ - _ - _ - "),
      "             ",
      "             ",
    ],
  },
};

/**
 * Map of weather condition codes to icon names
 * Equivalent to the iconMap in getWeatherIcon() in the Go project
 */
export const weatherCodeToIcon: Record<number, string> = {
  // Thunderstorm
  200: "Thunderstorm",
  201: "Thunderstorm",
  202: "Thunderstorm",
  210: "Thunderstorm",
  211: "Thunderstorm",
  212: "Thunderstorm",
  221: "Thunderstorm",
  230: "Thunderstorm",
  231: "Thunderstorm",
  232: "Thunderstorm",

  // Drizzle
  300: "LightShowers",
  301: "LightShowers",
  302: "LightShowers",
  310: "LightShowers",
  311: "LightShowers",
  312: "LightShowers",
  313: "LightShowers",
  314: "LightShowers",
  321: "LightShowers",

  // Rain
  500: "LightShowers",
  501: "LightShowers",
  502: "HeavyShowers",
  503: "HeavyShowers",
  504: "HeavyShowers",
  511: "LightSnow",
  520: "LightShowers",
  521: "LightShowers",
  522: "HeavyShowers",
  531: "HeavyShowers",

  // Snow
  600: "LightSnow",
  601: "HeavySnow",
  602: "HeavySnow",
  611: "LightSnow",
  612: "LightSnow",
  613: "LightSnow",
  615: "LightSnow",
  616: "LightSnow",
  620: "LightSnow",
  621: "HeavySnow",
  622: "HeavySnow",

  // Atmosphere
  701: "Fog",
  711: "Fog",
  721: "Fog",
  731: "Fog",
  741: "Fog",
  751: "Fog",
  761: "Fog",
  762: "Fog",
  771: "Fog",
  781: "Fog",

  // Clear
  800: "Sunny",

  // Clouds
  801: "PartlyCloudy",
  802: "Cloudy",
  803: "VeryCloudy",
  804: "VeryCloudy",

  // As the above codes are actually id from OpenWeatherMap API, they won't match any code from OpenMeteo API
  // Here is a list of matching codes for OpenMeteo API
  0: "Sunny",
  1: "Sunny",
  2: "PartlyCloud",
  3: "VeryCloudy",
  51: "LightShowers",
  53: "LightShowers",
  61: "LightShowers",
  80: "LightShowers",
  55: "HeavyShowers",
  63: "HeavyShowers",
  65: "HeavyShowers",
  81: "HeavyShowers",
  82: "HeavyShowers",
  71: "LightSnow",
  73: "LightSnow",
  85: "LightSnow",
  75: "HeavySnow",
  86: "HeavySnow",
  95: "ThunderStorm",
  96: "ThunderStorm",
  99: "ThunderStorm",
  45: "Fog",
  48: "Fog",
  56: "Fog",
  57: "Fog",
  66: "Fog",
  67: "Fog",
  77: "Fog",
};

/**
 * Map of weather condition names to icon names
 */
export const weatherNameToIcon: Record<string, string> = {
  Clear: "Sunny",
  Clouds: "Cloudy",
  Rain: "LightShowers",
  Drizzle: "LightShowers",
  Thunderstorm: "Thunderstorm",
  Snow: "LightSnow",
  Mist: "Fog",
  Smoke: "Fog",
  Haze: "Fog",
  Dust: "Fog",
  Fog: "Fog",
  Sand: "Fog",
  Ash: "Fog",
  Squall: "Fog",
  Tornado: "Fog",
};

/**
 * Get the appropriate icon for a weather condition
 */
export function getWeatherIcon(mainWeather: string, weatherCode: number, useColors: boolean): string[] {
  let iconName = "Unknown";

  // Try to get icon by weather code first
  if (weatherCode in weatherCodeToIcon) {
    iconName = weatherCodeToIcon[weatherCode];
  }
  // Fall back to weather main condition
  else if (mainWeather in weatherNameToIcon) {
    iconName = weatherNameToIcon[mainWeather];
  }

  // Get the icon (colored or monochrome)
  const icon = weatherIcons[iconName] || weatherIcons.Unknown;
  return useColors ? icon.colored : icon.monochrome;
}

/**
 * Get the wind direction symbol based on degrees
 */
export function getWindDirectionSymbol(degrees: number): string {
  const directions = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
  const index = Math.round(((degrees + 22.5) % 360) / 45) % 8;
  return directions[index];
}
