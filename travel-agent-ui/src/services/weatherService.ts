import { WeatherForecast, WeatherRegion } from '../types';

// Map US states to weather regions
const STATE_TO_REGION: Record<string, WeatherRegion> = {
  // Southwest
  AZ: 'southwest',
  NM: 'southwest',
  NV: 'southwest',
  UT: 'southwest',

  // Pacific Northwest
  WA: 'pacific_northwest',
  OR: 'pacific_northwest',

  // Mountain
  CO: 'mountain',
  MT: 'mountain',
  WY: 'mountain',
  ID: 'mountain',

  // California
  CA: 'california',

  // Midwest
  IL: 'midwest',
  IN: 'midwest',
  MI: 'midwest',
  OH: 'midwest',
  WI: 'midwest',
  MN: 'midwest',
  IA: 'midwest',
  MO: 'midwest',

  // Northeast
  NY: 'northeast',
  PA: 'northeast',
  NJ: 'northeast',
  CT: 'northeast',
  MA: 'northeast',
  NH: 'northeast',
  VT: 'northeast',
  ME: 'northeast',
  RI: 'northeast',

  // Southeast
  FL: 'southeast',
  GA: 'southeast',
  SC: 'southeast',
  NC: 'southeast',
  VA: 'southeast',
  TN: 'southeast',
  AL: 'southeast',
  MS: 'southeast',
  LA: 'southeast',
  AR: 'southeast',
  KY: 'southeast',
  WV: 'southeast',
  MD: 'southeast',
  DE: 'southeast',
  DC: 'southeast',

  // Plains
  TX: 'plains',
  OK: 'plains',
  KS: 'plains',
  NE: 'plains',
  SD: 'plains',
  ND: 'plains',

  // Alaska & Hawaii (special cases)
  AK: 'mountain',
  HI: 'california'
};

// Weather patterns by region and month (0-indexed)
const REGIONAL_WEATHER: Record<WeatherRegion, WeatherForecast[]> = {
  southwest: [
    { tempHigh: 65, tempLow: 40, condition: 'sunny', precipitation: 10, humidity: 25, description: 'Cool and dry' },
    { tempHigh: 70, tempLow: 45, condition: 'sunny', precipitation: 8, humidity: 22, description: 'Mild and sunny' },
    { tempHigh: 78, tempLow: 52, condition: 'sunny', precipitation: 5, humidity: 18, description: 'Warming up, dry' },
    { tempHigh: 88, tempLow: 58, condition: 'sunny', precipitation: 3, humidity: 15, description: 'Hot and dry' },
    { tempHigh: 98, tempLow: 68, condition: 'sunny', precipitation: 2, humidity: 12, description: 'Very hot' },
    { tempHigh: 105, tempLow: 78, condition: 'sunny', precipitation: 5, humidity: 15, description: 'Extreme heat' },
    { tempHigh: 105, tempLow: 82, condition: 'partly_cloudy', precipitation: 25, humidity: 30, description: 'Monsoon season' },
    { tempHigh: 102, tempLow: 78, condition: 'partly_cloudy', precipitation: 30, humidity: 35, description: 'Monsoon storms' },
    { tempHigh: 95, tempLow: 72, condition: 'sunny', precipitation: 15, humidity: 25, description: 'Still hot' },
    { tempHigh: 82, tempLow: 58, condition: 'sunny', precipitation: 8, humidity: 20, description: 'Pleasant fall' },
    { tempHigh: 70, tempLow: 45, condition: 'sunny', precipitation: 10, humidity: 25, description: 'Cool and clear' },
    { tempHigh: 62, tempLow: 38, condition: 'sunny', precipitation: 12, humidity: 28, description: 'Mild winter' }
  ],
  pacific_northwest: [
    { tempHigh: 48, tempLow: 35, condition: 'rainy', precipitation: 70, humidity: 80, description: 'Cool and rainy' },
    { tempHigh: 52, tempLow: 38, condition: 'rainy', precipitation: 65, humidity: 78, description: 'Mild rain' },
    { tempHigh: 55, tempLow: 40, condition: 'rainy', precipitation: 60, humidity: 72, description: 'Spring showers' },
    { tempHigh: 62, tempLow: 45, condition: 'partly_cloudy', precipitation: 45, humidity: 65, description: 'Warming slowly' },
    { tempHigh: 68, tempLow: 50, condition: 'partly_cloudy', precipitation: 35, humidity: 60, description: 'Pleasant spring' },
    { tempHigh: 75, tempLow: 55, condition: 'partly_cloudy', precipitation: 25, humidity: 55, description: 'Nice summer' },
    { tempHigh: 80, tempLow: 58, condition: 'sunny', precipitation: 15, humidity: 50, description: 'Best weather' },
    { tempHigh: 82, tempLow: 58, condition: 'sunny', precipitation: 12, humidity: 48, description: 'Warm and dry' },
    { tempHigh: 72, tempLow: 52, condition: 'partly_cloudy', precipitation: 30, humidity: 58, description: 'Fall arriving' },
    { tempHigh: 60, tempLow: 45, condition: 'rainy', precipitation: 55, humidity: 72, description: 'Rain returns' },
    { tempHigh: 50, tempLow: 38, condition: 'rainy', precipitation: 68, humidity: 78, description: 'Wet and cool' },
    { tempHigh: 45, tempLow: 35, condition: 'rainy', precipitation: 72, humidity: 82, description: 'Winter rain' }
  ],
  mountain: [
    { tempHigh: 35, tempLow: 15, condition: 'snowy', precipitation: 40, humidity: 55, description: 'Cold, snow likely' },
    { tempHigh: 40, tempLow: 18, condition: 'snowy', precipitation: 35, humidity: 50, description: 'Cold with snow' },
    { tempHigh: 48, tempLow: 25, condition: 'partly_cloudy', precipitation: 30, humidity: 45, description: 'Late winter' },
    { tempHigh: 58, tempLow: 32, condition: 'partly_cloudy', precipitation: 28, humidity: 42, description: 'Spring thaw' },
    { tempHigh: 68, tempLow: 40, condition: 'partly_cloudy', precipitation: 25, humidity: 38, description: 'Pleasant spring' },
    { tempHigh: 78, tempLow: 48, condition: 'sunny', precipitation: 20, humidity: 32, description: 'Warm days' },
    { tempHigh: 85, tempLow: 55, condition: 'sunny', precipitation: 22, humidity: 28, description: 'Hot afternoons' },
    { tempHigh: 82, tempLow: 52, condition: 'partly_cloudy', precipitation: 25, humidity: 30, description: 'Afternoon storms' },
    { tempHigh: 72, tempLow: 42, condition: 'sunny', precipitation: 18, humidity: 32, description: 'Perfect fall' },
    { tempHigh: 58, tempLow: 32, condition: 'partly_cloudy', precipitation: 25, humidity: 40, description: 'Cool fall' },
    { tempHigh: 42, tempLow: 22, condition: 'snowy', precipitation: 32, humidity: 50, description: 'Early snow' },
    { tempHigh: 35, tempLow: 15, condition: 'snowy', precipitation: 38, humidity: 55, description: 'Winter snow' }
  ],
  california: [
    { tempHigh: 62, tempLow: 45, condition: 'partly_cloudy', precipitation: 35, humidity: 65, description: 'Mild winter' },
    { tempHigh: 65, tempLow: 48, condition: 'partly_cloudy', precipitation: 32, humidity: 62, description: 'Cool, some rain' },
    { tempHigh: 68, tempLow: 50, condition: 'partly_cloudy', precipitation: 25, humidity: 58, description: 'Spring arriving' },
    { tempHigh: 72, tempLow: 52, condition: 'sunny', precipitation: 15, humidity: 52, description: 'Pleasant' },
    { tempHigh: 75, tempLow: 55, condition: 'sunny', precipitation: 8, humidity: 55, description: 'May gray' },
    { tempHigh: 78, tempLow: 58, condition: 'cloudy', precipitation: 5, humidity: 62, description: 'June gloom' },
    { tempHigh: 82, tempLow: 62, condition: 'sunny', precipitation: 2, humidity: 58, description: 'Warm summer' },
    { tempHigh: 85, tempLow: 65, condition: 'sunny', precipitation: 2, humidity: 55, description: 'Hot summer' },
    { tempHigh: 85, tempLow: 62, condition: 'sunny', precipitation: 3, humidity: 52, description: 'Warm fall' },
    { tempHigh: 78, tempLow: 55, condition: 'sunny', precipitation: 8, humidity: 48, description: 'Beautiful fall' },
    { tempHigh: 68, tempLow: 48, condition: 'partly_cloudy', precipitation: 20, humidity: 55, description: 'Cool, dry' },
    { tempHigh: 62, tempLow: 45, condition: 'partly_cloudy', precipitation: 30, humidity: 62, description: 'Mild winter' }
  ],
  midwest: [
    { tempHigh: 32, tempLow: 18, condition: 'snowy', precipitation: 45, humidity: 72, description: 'Cold winter' },
    { tempHigh: 38, tempLow: 22, condition: 'snowy', precipitation: 40, humidity: 68, description: 'Snowy' },
    { tempHigh: 50, tempLow: 32, condition: 'partly_cloudy', precipitation: 35, humidity: 62, description: 'Thawing' },
    { tempHigh: 62, tempLow: 42, condition: 'rainy', precipitation: 38, humidity: 58, description: 'Spring rain' },
    { tempHigh: 72, tempLow: 52, condition: 'partly_cloudy', precipitation: 35, humidity: 55, description: 'Nice spring' },
    { tempHigh: 82, tempLow: 62, condition: 'partly_cloudy', precipitation: 38, humidity: 60, description: 'Humid summer' },
    { tempHigh: 85, tempLow: 68, condition: 'partly_cloudy', precipitation: 35, humidity: 65, description: 'Hot, humid' },
    { tempHigh: 82, tempLow: 65, condition: 'partly_cloudy', precipitation: 32, humidity: 62, description: 'Warm, muggy' },
    { tempHigh: 72, tempLow: 55, condition: 'sunny', precipitation: 28, humidity: 55, description: 'Pleasant fall' },
    { tempHigh: 58, tempLow: 42, condition: 'partly_cloudy', precipitation: 30, humidity: 58, description: 'Cool fall' },
    { tempHigh: 42, tempLow: 28, condition: 'cloudy', precipitation: 38, humidity: 68, description: 'Late fall' },
    { tempHigh: 32, tempLow: 18, condition: 'snowy', precipitation: 42, humidity: 72, description: 'Winter cold' }
  ],
  northeast: [
    { tempHigh: 38, tempLow: 25, condition: 'snowy', precipitation: 42, humidity: 68, description: 'Cold winter' },
    { tempHigh: 42, tempLow: 28, condition: 'snowy', precipitation: 38, humidity: 65, description: 'Wintry mix' },
    { tempHigh: 52, tempLow: 35, condition: 'rainy', precipitation: 40, humidity: 60, description: 'Early spring' },
    { tempHigh: 62, tempLow: 45, condition: 'rainy', precipitation: 38, humidity: 55, description: 'Spring showers' },
    { tempHigh: 72, tempLow: 55, condition: 'partly_cloudy', precipitation: 35, humidity: 52, description: 'Nice spring' },
    { tempHigh: 80, tempLow: 65, condition: 'partly_cloudy', precipitation: 35, humidity: 58, description: 'Warm summer' },
    { tempHigh: 85, tempLow: 70, condition: 'partly_cloudy', precipitation: 38, humidity: 62, description: 'Hot, humid' },
    { tempHigh: 82, tempLow: 68, condition: 'partly_cloudy', precipitation: 35, humidity: 60, description: 'Warm, muggy' },
    { tempHigh: 72, tempLow: 58, condition: 'sunny', precipitation: 30, humidity: 55, description: 'Beautiful fall' },
    { tempHigh: 58, tempLow: 45, condition: 'partly_cloudy', precipitation: 32, humidity: 58, description: 'Fall foliage' },
    { tempHigh: 48, tempLow: 35, condition: 'cloudy', precipitation: 38, humidity: 65, description: 'Late fall' },
    { tempHigh: 38, tempLow: 25, condition: 'snowy', precipitation: 40, humidity: 68, description: 'Winter arrives' }
  ],
  southeast: [
    { tempHigh: 55, tempLow: 35, condition: 'partly_cloudy', precipitation: 35, humidity: 62, description: 'Mild winter' },
    { tempHigh: 60, tempLow: 40, condition: 'partly_cloudy', precipitation: 35, humidity: 60, description: 'Cool, pleasant' },
    { tempHigh: 68, tempLow: 48, condition: 'partly_cloudy', precipitation: 38, humidity: 58, description: 'Spring arriving' },
    { tempHigh: 75, tempLow: 55, condition: 'rainy', precipitation: 35, humidity: 55, description: 'Warm spring' },
    { tempHigh: 82, tempLow: 65, condition: 'partly_cloudy', precipitation: 35, humidity: 62, description: 'Warming up' },
    { tempHigh: 88, tempLow: 72, condition: 'partly_cloudy', precipitation: 45, humidity: 70, description: 'Hot, humid' },
    { tempHigh: 92, tempLow: 75, condition: 'stormy', precipitation: 52, humidity: 75, description: 'Hot, storms' },
    { tempHigh: 90, tempLow: 75, condition: 'stormy', precipitation: 50, humidity: 78, description: 'Hot, humid' },
    { tempHigh: 85, tempLow: 68, condition: 'partly_cloudy', precipitation: 42, humidity: 68, description: 'Still warm' },
    { tempHigh: 75, tempLow: 55, condition: 'sunny', precipitation: 30, humidity: 58, description: 'Pleasant fall' },
    { tempHigh: 62, tempLow: 42, condition: 'partly_cloudy', precipitation: 32, humidity: 60, description: 'Cool fall' },
    { tempHigh: 55, tempLow: 38, condition: 'partly_cloudy', precipitation: 35, humidity: 62, description: 'Mild winter' }
  ],
  plains: [
    { tempHigh: 50, tempLow: 28, condition: 'partly_cloudy', precipitation: 25, humidity: 55, description: 'Cool, dry' },
    { tempHigh: 55, tempLow: 32, condition: 'partly_cloudy', precipitation: 28, humidity: 52, description: 'Mild winter' },
    { tempHigh: 65, tempLow: 42, condition: 'partly_cloudy', precipitation: 32, humidity: 48, description: 'Spring arriving' },
    { tempHigh: 75, tempLow: 52, condition: 'stormy', precipitation: 40, humidity: 55, description: 'Storm season' },
    { tempHigh: 82, tempLow: 62, condition: 'stormy', precipitation: 45, humidity: 60, description: 'Tornado season' },
    { tempHigh: 92, tempLow: 70, condition: 'partly_cloudy', precipitation: 35, humidity: 55, description: 'Hot summer' },
    { tempHigh: 98, tempLow: 75, condition: 'sunny', precipitation: 25, humidity: 48, description: 'Very hot' },
    { tempHigh: 95, tempLow: 72, condition: 'sunny', precipitation: 28, humidity: 50, description: 'Hot, dry' },
    { tempHigh: 85, tempLow: 62, condition: 'sunny', precipitation: 30, humidity: 52, description: 'Warm fall' },
    { tempHigh: 72, tempLow: 50, condition: 'sunny', precipitation: 28, humidity: 50, description: 'Pleasant fall' },
    { tempHigh: 58, tempLow: 38, condition: 'partly_cloudy', precipitation: 25, humidity: 52, description: 'Cool fall' },
    { tempHigh: 50, tempLow: 30, condition: 'partly_cloudy', precipitation: 22, humidity: 55, description: 'Mild winter' }
  ]
};

// Get state abbreviation from full name
const STATE_NAMES: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC', 'Washington DC': 'DC', 'Washington D.C.': 'DC'
};

function getStateAbbreviation(state: string): string {
  // If already an abbreviation
  if (state.length === 2) {
    return state.toUpperCase();
  }
  // Look up full name
  return STATE_NAMES[state] || 'CA'; // Default to California
}

function getRegion(state: string): WeatherRegion {
  const abbrev = getStateAbbreviation(state);
  return STATE_TO_REGION[abbrev] || 'california';
}

export function getMockWeather(state: string, month: number): WeatherForecast {
  const region = getRegion(state);
  const monthIndex = Math.max(0, Math.min(11, month - 1)); // Convert 1-12 to 0-11
  const baseWeather = REGIONAL_WEATHER[region][monthIndex];

  // Add some variance to make it more realistic
  const variance = (Math.random() - 0.5) * 6;
  return {
    ...baseWeather,
    tempHigh: Math.round(baseWeather.tempHigh + variance),
    tempLow: Math.round(baseWeather.tempLow + variance)
  };
}

export function getWeatherForCity(_city: string, state: string, month: number): WeatherForecast {
  return getMockWeather(state, month);
}

export function getWeatherIcon(condition: WeatherForecast['condition']): string {
  const icons: Record<WeatherForecast['condition'], string> = {
    sunny: '\u2600\ufe0f',
    partly_cloudy: '\u26c5',
    cloudy: '\u2601\ufe0f',
    rainy: '\ud83c\udf27\ufe0f',
    snowy: '\u2744\ufe0f',
    stormy: '\u26c8\ufe0f'
  };
  return icons[condition];
}

export function formatTemperature(temp: number): string {
  return `${temp}\u00b0F`;
}
