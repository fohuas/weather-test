// 定义城市数据类型
export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

// 定义天气数据类型
export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  city: City;
  description?: string;
  icon?: string;
}

// 默认城市列表（作为备用）
export const defaultCities: City[] = [
  { name: "北京", latitude: 39.9042, longitude: 116.4074, country: "中国" },
  { name: "上海", latitude: 31.2304, longitude: 121.4737, country: "中国" },
  { name: "广州", latitude: 23.1291, longitude: 113.2644, country: "中国" },
  { name: "深圳", latitude: 22.5431, longitude: 114.0579, country: "中国" },
  { name: "东京", latitude: 35.6762, longitude: 139.6503, country: "日本" },
  { name: "纽约", latitude: 40.7128, longitude: -74.0060, country: "美国" },
  { name: "伦敦", latitude: 51.5074, longitude: -0.1278, country: "英国" },
  { name: "巴黎", latitude: 48.8566, longitude: 2.3522, country: "法国" },
  { name: "悉尼", latitude: 33.8688, longitude: 151.2093, country: "澳大利亚" },
  { name: "莫斯科", latitude: 55.7558, longitude: 37.6173, country: "俄罗斯" },
];

// 存储从API获取的城市列表
let cities: City[] = [...defaultCities];

// 从API获取城市列表
export async function fetchCities(): Promise<City[]> {
  try {
    const response = await fetch('/api/cities');
    if (!response.ok) {
      throw new Error('获取城市列表失败');
    }
    const data = await response.json();
    cities = data.cities;
    return cities;
  } catch (error) {
    console.error('获取城市列表时出错:', error);
    return defaultCities; // 如果获取失败，返回默认城市列表
  }
}

// 获取城市列表
export function getCities(): City[] {
  return cities;
}

// 获取随机城市
export function getRandomCity(): City {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
}

// 获取天气代码对应的描述和图标
export function getWeatherInfo(code: number): { description: string; icon: string } {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const weatherCodes: Record<number, { description: string; icon: string }> = {
    0: { description: "晴朗", icon: "☀️" },
    1: { description: "大部晴朗", icon: "🌤️" },
    2: { description: "部分多云", icon: "⛅" },
    3: { description: "多云", icon: "☁️" },
    45: { description: "雾", icon: "🌫️" },
    48: { description: "霾", icon: "🌫️" },
    51: { description: "小毛毛雨", icon: "🌦️" },
    53: { description: "毛毛雨", icon: "🌦️" },
    55: { description: "大毛毛雨", icon: "🌧️" },
    56: { description: "小冻雨", icon: "🌨️" },
    57: { description: "大冻雨", icon: "🌨️" },
    61: { description: "小雨", icon: "🌧️" },
    63: { description: "中雨", icon: "🌧️" },
    65: { description: "大雨", icon: "🌧️" },
    66: { description: "小冰雨", icon: "🌨️" },
    67: { description: "大冰雨", icon: "🌨️" },
    71: { description: "小雪", icon: "❄️" },
    73: { description: "中雪", icon: "❄️" },
    75: { description: "大雪", icon: "❄️" },
    77: { description: "雪粒", icon: "❄️" },
    80: { description: "小阵雨", icon: "🌦️" },
    81: { description: "中阵雨", icon: "🌦️" },
    82: { description: "大阵雨", icon: "🌦️" },
    85: { description: "小阵雪", icon: "🌨️" },
    86: { description: "大阵雪", icon: "🌨️" },
    95: { description: "雷暴", icon: "⛈️" },
    96: { description: "雷暴伴有小冰雹", icon: "⛈️" },
    99: { description: "雷暴伴有大冰雹", icon: "⛈️" },
  };

  return weatherCodes[code] || { description: "未知", icon: "❓" };
}

// 从Open-Meteo API获取天气数据
export async function fetchWeatherData(city: City): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
    );
    
    if (!response.ok) {
      throw new Error(`获取天气数据失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      city: city
    };
  } catch (error) {
    console.error("获取天气数据时出错:", error);
    throw error;
  }
}

// 使用OpenWeatherMap API获取天气数据
export async function fetchOpenWeatherMapData(city: City, apiKey: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${apiKey}&units=metric&lang=zh_cn`
    );
    
    if (!response.ok) {
      throw new Error(`获取OpenWeatherMap数据失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      weatherCode: data.weather[0].id,
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
      city: city,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
  } catch (error) {
    console.error("获取OpenWeatherMap数据时出错:", error);
    throw error;
  }
} 