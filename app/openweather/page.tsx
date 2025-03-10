'use client';

import { useState, useEffect } from 'react';
import { City, WeatherData, cities, fetchOpenWeatherMapData } from '../services/weatherService';
import Image from 'next/image';
import Link from 'next/link';

export default function OpenWeatherPage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  // 从环境变量获取API密钥
  useEffect(() => {
    // 在客户端，我们需要通过API获取环境变量
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/getApiKey');
        const data = await response.json();
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
      } catch (err) {
        setError('无法获取API密钥，请确保已设置环境变量');
        console.error('获取API密钥失败:', err);
      }
    };

    fetchApiKey();
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const city = cities.find(c => c.name === cityName) || null;
    setSelectedCity(city);
  };

  const fetchWeather = async () => {
    if (!selectedCity || !apiKey) {
      setError('请选择城市并确保API密钥已设置');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOpenWeatherMapData(selectedCity, apiKey);
      setWeatherData(data);
    } catch (err) {
      setError('获取天气数据失败，请稍后再试');
      console.error('获取天气数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold mb-8 text-center">OpenWeatherMap 天气查询</h1>
        
        <div className="bg-white/30 p-6 rounded-lg shadow-lg backdrop-blur-md w-full max-w-2xl mx-auto">
          <div className="mb-6">
            <label htmlFor="city-select" className="block text-lg mb-2">选择城市:</label>
            <select 
              id="city-select"
              className="w-full p-2 border border-gray-300 rounded-md bg-white/80"
              onChange={handleCityChange}
              value={selectedCity?.name || ''}
            >
              <option value="">-- 请选择城市 --</option>
              {cities.map(city => (
                <option key={`${city.name}-${city.country}`} value={city.name}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={fetchWeather}
            disabled={loading || !selectedCity || !apiKey}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '加载中...' : '获取天气'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {weatherData && (
            <div className="mt-6 p-4 bg-white/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{weatherData.city.name}, {weatherData.city.country}</h2>
                  <p className="text-lg">{weatherData.description}</p>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">{weatherData.temperature.toFixed(1)}°C</p>
                    <p>湿度: {weatherData.humidity}%</p>
                    <p>风速: {weatherData.windSpeed} m/s</p>
                  </div>
                </div>
                {weatherData.icon && (
                  <div className="w-24 h-24 relative">
                    <img 
                      src={weatherData.icon} 
                      alt={weatherData.description || '天气图标'} 
                      width={96}
                      height={96}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
} 