import chalk from "chalk";
import { Config, WeatherData, UNIT_CONVERSION, PROVIDERS } from "./types";
import { getWeatherIcon, getWindDirectionSymbol } from "./icons";

/**
 * Convert Celsius to Fahrenheit
 */
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

function getColoredWeatherText(mainWeather: string, description: string): string {
  switch (mainWeather) {
    case "Clear":
      return chalk.yellow.bold(description);
    case "Clouds":
      return chalk.magenta.bold(description);
    case "Rain":
      return chalk.blue.bold(description);
    case "Snow":
      return chalk.cyan.bold(description);
    case "Thunderstorm":
      return chalk.bgRed.bold(description);
    default:
      return chalk.red.bold(description);
  }
}

function displayWeatherArtAligned(
  mainWeather: string,
  weatherCode: number,
  labels: string[],
  values: string[],
  config: Config,
): void {
  const iconLines = getWeatherIcon(mainWeather, weatherCode, config.useColors);

  // Find the max label length for alignment
  const maxLabelLen = Math.max(...labels.map((label) => label.length));

  // Apply colors to values if enabled
  const coloredLabels: string[] = [];
  const coloredValues: string[] = [];

  for (let i = 0; i < labels.length; i++) {
    // Apply colors to labels if enabled
    coloredLabels.push(config.useColors ? chalk.blue(labels[i]) : labels[i]);

    // Apply colors to values if enabled
    if (config.useColors) {
      switch (i) {
        case 0: // City
          coloredValues.push(chalk.green.bold(values[i]));
          break;
        case 1: // Weather description
          coloredValues.push(getColoredWeatherText(mainWeather, values[i]));
          break;
        case 2: // Temperature
          coloredValues.push(chalk.red(values[i]));
          break;
        case 3: // Wind
          coloredValues.push(chalk.green(values[i]));
          break;
        case 4: // Humidity
          coloredValues.push(chalk.cyan(values[i]));
          break;
        case 5: // Precipitation
          const parts = values[i].split("|");
          if (parts.length === 2) {
            coloredValues.push(chalk.blue(parts[0].trim()) + " | " + chalk.cyan(parts[1].trim()));
          } else {
            coloredValues.push(chalk.blue(values[i]));
          }
          break;
        default:
          coloredValues.push(values[i]);
      }
    } else {
      coloredValues.push(values[i]);
    }
  }

  // Prepare the text lines
  const textLines: string[] = [""]; // Empty line to match icon top spacing

  // Add formatted lines with aligned labels and values
  for (let i = 0; i < labels.length; i++) {
    const label = config.useColors ? coloredLabels[i] : labels[i];
    const value = config.useColors ? coloredValues[i] : values[i];

    // Pad the label to align values
    const paddedLabel = label.padEnd(maxLabelLen);
    textLines.push(`${paddedLabel} ${value}`);
  }
  textLines.push(""); // Empty line to match icon bottom spacing

  // Print the weather art and text
  for (let i = 0; i < Math.max(iconLines.length, textLines.length); i++) {
    const iconLine = i < iconLines.length ? iconLines[i] : "";
    const textLine = i < textLines.length ? textLines[i] : "";
    console.log(`${iconLine}  ${textLine}`);
  }
}

function displayWeatherArtCompacted(
  mainWeather: string,
  weatherCode: number,
  cityName: string,
  weatherDisplay: string,
  tempDisplay: string,
  windDisplay: string,
  humidityDisplay: string,
  precipDisplay: string,
  config: Config,
): void {
  // Get the weather icon
  const iconLines = getWeatherIcon(mainWeather, weatherCode, config.useColors);

  // Apply colors if enabled
  if (config.useColors) {
    if (cityName && config.showCityName) {
      cityName = chalk.green.bold(cityName);
    }
    weatherDisplay = getColoredWeatherText(mainWeather, weatherDisplay);
    tempDisplay = chalk.red(tempDisplay);
    windDisplay = chalk.green(windDisplay);
    humidityDisplay = chalk.cyan(humidityDisplay);

    // Split precipitation display into rain and rate parts
    const parts = precipDisplay.split("|"); // Format: "Rain | 0.5 mm/hr" or "0.5 mm/hr"
    if (parts.length === 2) {
      precipDisplay = chalk.blue(parts[0].trim()) + " | " + chalk.cyan(parts[1].trim());
    } else {
      precipDisplay = chalk.blue(precipDisplay);
    }
  }

  // Prepare the text lines
  const textLines: string[] = [""]; // Empty line to match icon top spacing

  if (cityName && config.showCityName) {
    textLines.push(cityName);
  }

  textLines.push(weatherDisplay, tempDisplay, windDisplay, humidityDisplay);

  if (precipDisplay) {
    textLines.push(precipDisplay);
  }

  textLines.push(""); // Empty line to match icon bottom spacing

  // Print icon and text lines together
  for (let i = 0; i < Math.max(iconLines.length, textLines.length); i++) {
    const iconLine = i < iconLines.length ? iconLines[i] : "";
    const textLine = i < textLines.length ? textLines[i] : "";
    console.log(`${iconLine}  ${textLine}`);
  }
}

export function displayWeather(weather: WeatherData, config: Config): void {
  const mainWeather = weather.condition || "Unknown";
  const description = weather.description || "Unknown conditions";
  const weatherCode = weather.weatherCode || 0;

  // Determine units based on config
  let windSpeedUnit = "km/h";
  let tempUnit = "°C";

  let windSpeed = weather.windSpeed;
  let temp = weather.temperature;

  // Apply unit conversions
  if (config.units == "imperial") {
    windSpeedUnit = "mph";
    tempUnit = "°F";

    // Convert temperature for both providers
    temp = celsiusToFahrenheit(temp);

    // Convert wind speed based on provider
    if (config.provider === PROVIDERS.OPEN_WEATHER_MAP) {
      windSpeed *= UNIT_CONVERSION.MPS_TO_MPH; // m/s to mph
    } else {
      windSpeed *= UNIT_CONVERSION.KMPH_TO_MPH; // km/h to mph
    }
  } else {
    windSpeedUnit = "km/h";
    tempUnit = "°C";

    // Convert wind speed based on provider
    if (config.provider === PROVIDERS.OPEN_WEATHER_MAP) {
      windSpeed *= UNIT_CONVERSION.MPS_TO_KMPH; // m/s to km/h
    }
  }

  // Format precipitation info
  const precipMM = weather.precipitation || 0;
  const popPercent = Math.round(weather.pop || 0) * 100;

  // Prepare labels and values arrays
  const labels: string[] = [];
  const values: string[] = [];

  // City name display
  let cityName = weather.cityName || "";
  if (config.city || !cityName) {
    cityName = config.city;
  }

  // In compact mode, we'll just show the city name in the display function
  if (config.showCityName) {
    if (!config.compact) {
      labels.push("City");
      values.push(cityName);
    }
  }

  // Weather Info
  if (!config.compact) {
    labels.push("Weather ");
    values.push(description);

    labels.push("Temp ");
    values.push(`${temp.toFixed(1)}${tempUnit}`);

    labels.push("Wind ");
    values.push(`${windSpeed.toFixed(1)} ${windSpeedUnit} ${getWindDirectionSymbol(weather.windDirection)}`);

    labels.push("Humidity ");
    values.push(`${weather.humidity}%`);

    labels.push("Precip ");
    values.push(`${precipMM.toFixed(1)} mm | ${popPercent}%`);

    // For standard mode, display with aligned labels and values
    displayWeatherArtAligned(mainWeather, weatherCode, labels, values, config);
  } else {
    // Compact mode doesn't use labels in the same way
    const weatherDisplay = description;
    const tempDisplay = `${temp.toFixed(1)}${tempUnit}`;
    const windDisplay = `${windSpeed.toFixed(1)}${windSpeedUnit} ${getWindDirectionSymbol(weather.windDirection)}`;
    const humidityDisplay = `${weather.humidity}%`;
    const precipDisplay = `${precipMM.toFixed(1)}mm | ${popPercent}%`;

    displayWeatherArtCompacted(
      mainWeather,
      weatherCode,
      cityName,
      weatherDisplay,
      tempDisplay,
      windDisplay,
      humidityDisplay,
      precipDisplay,
      config,
    );
  }
}
