'use client';

import { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import { fetchWeatherData, getRandomCity, WeatherData } from './services/weatherService';
import Link from 'next/link';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomCityWeather = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const randomCity = getRandomCity();
      const data = await fetchWeatherData(randomCity);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomCityWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">全球天气随机展示</h1>
          <div className="flex justify-center mt-2">
            <Link 
              href="/openweather" 
              className="text-blue-500 hover:text-blue-700 underline"
            >
              使用OpenWeatherMap查看天气
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <WeatherCard 
          weatherData={weatherData}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchRandomCityWeather}
        />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>数据来源: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Open-Meteo API</a></p>
        </div>
      </footer>
    </div>
  );
}
