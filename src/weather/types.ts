/**
 * Configuration for the weather module
 */
export interface Config {
  provider: (typeof PROVIDERS)[keyof typeof PROVIDERS];
  apiKey: string;
  city: string;
  units: "metric" | "imperial";
  showCityName: boolean;
  useColors: boolean;
  compact: boolean;
}

/**
 * Command-line options for the weather module
 */
export interface CommandLineOptions {
  city?: string;
  units?: "metric" | "imperial";
  showCityName?: boolean;
  useColors?: boolean;
  compact?: boolean;
  help?: boolean;
  showConfig?: boolean;
}

/**
 * Weather data from  OpenWeatherMap API
 */
export interface OpenWeatherMapData {
  weather: Array<{
    id: number;
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    "1h"?: number;
  };
  clouds: {
    all: number;
  };
  pop?: number;
  name: string;
  dt: number;
}

/**
 * Weather data from OpenMeteo API
 */
export interface OpenMeteoData {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    weather_code: number;
    precipitation: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
}

/**
 * Unified weather data for display
 */
export interface WeatherData {
  condition: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  cityName: string;
  timestamp: number;
  weatherCode: number;
  pop: number;
}

/**
 * Supported weather providers
 */
export const PROVIDERS = {
  OPEN_WEATHER_MAP: "OpenWeatherMap",
  OPEN_METEO: "OpenMeteo",
} as const;

/**
 * Unit conversion constants
 */
export const UNIT_CONVERSION = {
  MPS_TO_MPH: 2.23694,
  KMPH_TO_MPH: 0.621371,
  MPS_TO_KMPH: 3.6,
} as const;
