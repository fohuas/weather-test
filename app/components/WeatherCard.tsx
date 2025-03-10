'use client';

import { useState, useEffect } from 'react';
import { WeatherData, getWeatherInfo } from '../services/weatherService';

interface WeatherCardProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function WeatherCard({ weatherData, isLoading, error, onRefresh }: WeatherCardProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-auto animate-pulse">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-4 text-center">获取天气数据时出错</h2>
        <p className="text-red-500 mb-4 text-center">{error}</p>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const { temperature, weatherCode, windSpeed, humidity, city } = weatherData;
  const { description, icon } = getWeatherInfo(weatherCode);
  
  // 获取当前时间
  const now = new Date();
  const formattedDate = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
  const formattedTime = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="flex flex-col p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-auto transition-all hover:shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{city.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{city.country}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formattedTime}</p>
        </div>
        <div className="text-6xl">{icon}</div>
      </div>
      
      <div className="flex items-end mb-6">
        <span className="text-5xl font-bold">{Math.round(temperature)}</span>
        <span className="text-2xl ml-1">°C</span>
      </div>
      
      <p className="text-xl mb-6">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-gray-500 dark:text-gray-400 text-sm">湿度</span>
          <span className="text-lg font-medium">{humidity}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 dark:text-gray-400 text-sm">风速</span>
          <span className="text-lg font-medium">{windSpeed} km/h</span>
        </div>
      </div>
      
      <button 
        onClick={onRefresh}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors self-center mt-2"
      >
        随机查看其他城市
      </button>
    </div>
  );
} 