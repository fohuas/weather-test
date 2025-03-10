import { useState, useEffect, useRef } from 'react';
import { City, getCities, fetchCities } from '../services/weatherService';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取城市列表
  useEffect(() => {
    const loadCities = async () => {
      setIsLoading(true);
      try {
        // 先使用本地缓存的城市列表
        const cachedCities = getCities();
        setAllCities(cachedCities);
        
        // 然后从API获取最新的城市列表
        const cities = await fetchCities();
        setAllCities(cities);
      } catch (error) {
        console.error('加载城市列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCities();
  }, []);

  // 过滤城市列表
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities([]);
      return;
    }

    const filtered = allCities.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, allCities]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-6" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={isLoading ? "加载城市列表中..." : "搜索城市..."}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={isLoading}
        />
        {searchTerm && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      {isDropdownOpen && filteredCities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.map((city) => (
            <div
              key={`${city.name}-${city.country}`}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleCitySelect(city)}
            >
              <div className="font-medium">{city.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{city.country}</div>
            </div>
          ))}
        </div>
      )}
      
      {isDropdownOpen && searchTerm && filteredCities.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 text-center">
          未找到匹配的城市
        </div>
      )}
    </div>
  );
} 