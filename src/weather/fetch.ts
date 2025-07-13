import axios, { AxiosError } from "axios";
import { OpenWeatherMapData, OpenMeteoData, WeatherData, PROVIDERS, Config } from "./types";

/**
 * Interface for geocoding results
 */
interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface GeoResponse {
  results: GeoResult[];
}

function weatherCodeToSentence(code: number): string {
  const weatherDescriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherDescriptions[code] || "Unknown weather condition";
}

async function getFirstGeoResult(city: string): Promise<GeoResult> {
  try {
    const encodedCity = encodeURIComponent(city);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1`;

    // Make the API Call
    const response = await axios.get<GeoResponse>(url);

    // Check if we got any results
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error(`No results found for city query ${city}`);
    }
    return response.data.results[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        throw new Error(`Geocoding API error: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        // The request was made but no response was received
        throw new Error(`Geocoding API error: No response received`);
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Geocoding API error: ${axiosError.message}`);
      }
    }
    // Just rethrow if it's not an AxiosError
    throw error;
  }
}

function convertToOpenMeteoWeatherData(data: OpenMeteoData, cityName: string): WeatherData {
  return {
    condition: weatherCodeToSentence(data.current.weather_code),
    description: weatherCodeToSentence(data.current.weather_code),
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    precipitation: data.current.precipitation,
    cityName,
    timestamp: new Date(data.current.time).getTime() / 1000, // Convert to Unix timestamp
    weatherCode: data.current.weather_code,
    pop: 0, // Pop is not available in OpenMeteo API, so we use 0 as default value
  };
}

async function fetchOpenMeteoWeatherData(config: Config): Promise<WeatherData> {
  try {
    const cityGeo = await getFirstGeoResult(config.city);
    // Construct the API URL
    // OpenMeteo expects latitude and longitude so we need to get the geolocation first
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityGeo.latitude}&longitude=${cityGeo.longitude}&current=temperature_2m,weather_code,precipitation,relative_humidity_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh&temperature_unit=celsius`;

    // Make the API Call
    const response = await axios.get<OpenMeteoData>(url);

    return convertToOpenMeteoWeatherData(response.data, config.city);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`OpenMeteo API error: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        throw new Error(`OpenMeteo API error: No response received`);
      } else {
        throw new Error(`OpenMeteo API error: ${axiosError.message}`);
      }
    }
    // Just rethrow if it's not an AxiosError
    throw error;
  }
}

function convertOpenWeatherMapToWeatherData(data: OpenWeatherMapData): WeatherData {
  return {
    condition: data.weather[0]?.main || "Unknown",
    description: data.weather[0]?.description || "Unknown conditions",
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    precipitation: data.rain?.["1h"] || 0,
    cityName: data.name,
    timestamp: data.dt,
    weatherCode: data.weather[0]?.id || 0,
    pop: data.pop || 0, // Pop is not always present in the response, so we use 0 as default value
  };
}

async function fetchOpenWeatherMapWeatherData(config: Config): Promise<WeatherData> {
  try {
    // URL encode the city name
    const encodedCity = encodeURIComponent(config.city);

    // Construct the API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&APPID=${config.apiKey}`;

    // Make the API Call
    const response = await axios.get<OpenWeatherMapData>(url);

    return convertOpenWeatherMapToWeatherData(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new Error(`OpenWeatherMap API error: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        throw new Error(`OpenWeatherMap API error: No response received`);
      } else {
        throw new Error(`OpenWeatherMap API error: ${axiosError.message}`);
      }
    }
    // Just rethrow if it's not an AxiosError
    throw error;
  }
}

export async function fetchWeather(config: Config): Promise<WeatherData>{
    if (config.provider === PROVIDERS.OPEN_WEATHER_MAP) {
      return fetchOpenWeatherMapWeatherData(config);
    } else if (config.provider === PROVIDERS.OPEN_METEO) {
      return fetchOpenMeteoWeatherData(config);
    } else {
      throw new Error(`Unsupported weather provider: ${config.provider}`);
    }
}